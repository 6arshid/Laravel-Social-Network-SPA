<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function index(Request $request)
{
    $user = auth()->user();
    $followingIds = $user->followings()->pluck('users.id');

    // پست‌های کاربران فالو شده (تب Followed)
    $followedPosts = Post::with([
            'media', 'user', 'likes',
            'comments.user', 'comments.likes',
            'comments.replies.user', 'comments.replies.likes',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->whereIn('user_id', $followingIds)
        ->latest()
        ->paginate(10, ['*'], 'followed_page');

  $explorerPosts = Post::with([
        'media', 'user', 'likes',
        'comments.user', 'comments.likes',
        'comments.replies.user', 'comments.replies.likes',
        'repost' => fn($q) => $q->with('user', 'media'),
    ])
    ->whereHas('user', function ($query) {
        $query->where('is_private', false);
    })
    ->latest()
    ->paginate(10, ['*'], 'explorer_page');


    $suggestedUsers = [];
    if ($followingIds->isEmpty()) {
        $suggestedUsers = User::where('id', '!=', $user->id)
            ->latest()
            ->take(20)
            ->get(['id', 'name', 'username', 'avatar']);
    }

    return Inertia::render('Dashboard', [
        'followedPosts' => $followedPosts,
        'explorerPosts' => $explorerPosts,
        'suggestedUsers' => $suggestedUsers,
    ]);
}

    
    
}

