<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Post;
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $followingIds = $user->followings()->pluck('users.id');
    
        $userIds = auth()->user()->followings()->select('users.id')->pluck('id');

        $posts = Post::with([
            'media',
            'user',
            'likes',
            'comments.user',
            'comments.likes',
            'comments.replies.user',
            'comments.replies.likes',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->whereIn('user_id', $userIds)
        ->latest()
->paginate(10);
    
        // فقط اگه هیچ کسی رو دنبال نکرده باشه، پیشنهاد بده
        $suggestedUsers = [];
        if ($followingIds->isEmpty()) {
            $suggestedUsers = User::where('id', '!=', $user->id)
                ->latest()
                ->take(20)
                ->get(['id', 'name', 'username', 'avatar']);
        }
    
        return Inertia::render('Dashboard', [
            'posts' => $posts,
            'suggestedUsers' => $suggestedUsers,
        ]);
    }
    
    
}

