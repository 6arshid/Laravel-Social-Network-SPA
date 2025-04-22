<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Support\Facades\Auth;
use App\Helpers\NotificationHelper;

class LikeController extends Controller
{
    public function toggle(Post $post)
    {
        $like = $post->likes()->where('user_id', auth()->id());

        if ($like->exists()) {
            $like->delete();
        } else {
            $post->likes()->create([
                'user_id' => auth()->id(),
            ]);
        }

        return back();
    }

    public function store(Request $request, Post $post)
    {
        $user = Auth::user();
        $emoji = $request->input('emoji');
    
        if (!$user) {
            return response()->json([
                'message' => 'You must be logged in to react to posts.'
            ], 401);
        }
    
        // Existing reaction
        $existing = $post->likes()->where('user_id', $user->id)->first();
    
        // If same emoji again, remove it
        if ($existing && $existing->emoji === $emoji) {
            $existing->delete();
        } else {
            // If different or no emoji, replace
            if ($existing) {
                $existing->delete();
            }
    
            $post->likes()->create([
                'user_id' => $user->id,
                'emoji' => $emoji,
            ]);
    
            NotificationHelper::send(
                $post->user_id,
                $user->name . ' reacted to your post.',
                route('posts.show', $post->id)
            );
        }
    
        return response()->json([
            'likes_count' => $post->likes()->count(),
            'reactions' => $post->likes()->get(),
        ]);
    }
    
}
