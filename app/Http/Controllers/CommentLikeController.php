<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use Illuminate\Http\Request;

class CommentLikeController extends Controller
{
    public function toggle(Request $request, Comment $comment)
    {
        $request->validate([
            'is_like' => 'required|boolean',
        ]);

        $existing = $comment->likes()->where('user_id', auth()->id())->first();

        if ($existing) {
            $existing->delete();
        }

        $comment->likes()->create([
            'user_id' => auth()->id(),
            'is_like' => $request->is_like,
        ]);

        return back();
    }
}
