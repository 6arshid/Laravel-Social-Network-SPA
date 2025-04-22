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
    
        $posts = Post::with(['user', 'media', 'likes', 'comments'])
            ->whereIn('user_id', $followingIds)
            ->latest()
            ->paginate(10)
            ->withQueryString();
    
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

