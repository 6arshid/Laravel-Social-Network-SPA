<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Helpers\NotificationHelper;
use App\Models\Post;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, $postId)
    {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'You must be logged in to post a comment.'
            ], 401);
        }

        $request->validate([
            'body' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        if ($request->parent_id) {
            $parent = Comment::find($request->parent_id);
            if ($parent->parent_id) {
                return response()->json([
                    'error' => 'Cannot reply to a reply.'
                ], 422);
            }
        }

        $post = Post::findOrFail($postId); // ❗ This must remain

        $comment = Comment::create([
            'user_id' => auth()->id(),
            'post_id' => $postId,
            'body' => $request->body,
            'parent_id' => $request->parent_id
        ]);

        if ($post->user_id !== auth()->id()) {
            NotificationHelper::send(
                $post->user_id,
                auth()->user()->name . ' commented on your post.',
                route('posts.show', $postId)
            );
        }

        $comment->load('user');

        return response()->json([
            'message' => 'Comment added successfully.',
            'comment' => $comment
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment); // 🔐 only owner

        $request->validate(['body' => 'required|string']);

        $comment->update([
            'body' => $request->body
        ]);

        return back();
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment); // 🔐 only owner

        $comment->delete();

        return back();
    }
}
