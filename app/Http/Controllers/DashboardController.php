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
        
        // پیدا کردن یوزر با بیشترین پست از بین فالوئینگ‌ها
        $topUserId = Post::whereIn('user_id', $followingIds)
            ->select('user_id', DB::raw('COUNT(*) as post_count'))
            ->groupBy('user_id')
            ->orderByDesc('post_count')
            ->first()?->user_id;
        
        // پست‌های یوزری که بیشترین پست رو داره از بین فالوئینگ‌ها
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
            ->when($topUserId, fn($query) => $query->where('user_id', $topUserId))
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

