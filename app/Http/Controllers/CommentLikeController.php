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

    $user = $request->user();

    $existing = $comment->likes()->where('user_id', $user->id)->first();

    if ($existing) {
        $existing->delete();
    }

    $comment->likes()->create([
        'user_id' => $user->id,
        'is_like' => $request->is_like,
    ]);

    // برای اطمینان از این‌که `likes` همیشه ارسال می‌شود:
    $comment->load('likes');

    return response()->json([
        'message' => 'Like updated successfully',
        'likes' => $comment->likes,
    ]);
}


}
