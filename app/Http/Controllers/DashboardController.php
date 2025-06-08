<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Post;
use Illuminate\Support\Str; // بالای فایل برای اطمینان

use Illuminate\Support\Facades\DB;
class DashboardController extends Controller
{
    public function index(Request $request)
{
    $user = auth()->user();
    $followingIds = $user->followings()->pluck('users.id');
    $blockedIds = $user->blockedIds()->merge($user->blockedByIds());

    // پست‌های کاربران فالو شده (تب Followed)
    $followedPosts = Post::with([
            'media', 'user', 'likes',
            'comments.user', 'comments.likes',
            'comments.replies.user', 'comments.replies.likes',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->whereIn('user_id', $followingIds)
        ->whereNotIn('user_id', $blockedIds)
        ->latest()
        ->paginate(10, ['*'], 'followed_page');

  $explorerPosts = Post::with([
        'media', 'user', 'likes',
        'comments.user', 'comments.likes',
        'comments.replies.user', 'comments.replies.likes',
        'repost' => fn($q) => $q->with('user', 'media'),
    ])
    ->where(function ($query) {
        $query->whereHas('user', fn($q) => $q->where('is_private', false))
              ->orWhereNotNull('user_page_id');
    })
    ->whereNotIn('user_id', $blockedIds)
    ->latest()
    ->paginate(10, ['*'], 'explorer_page');

  // حذف repost های کاربران بلاک شده یا خصوصی که اجازه مشاهده ندارند
  foreach ([$followedPosts, $explorerPosts] as $collection) {
      $collection->getCollection()->transform(function ($post) use ($user) {
          $repost = $post->repost;
          if ($repost) {
              $originalUser = $repost->user;

              if ($user->hasBlocked($originalUser) || $user->isBlockedBy($originalUser)) {
                  $post->repost = null;
                  return $post;
              }

              if ($originalUser->is_private) {
                  $isOwner = $user->id === $originalUser->id;
                  $isFollower = DB::table('follows')
                      ->where('follower_id', $user->id)
                      ->where('following_id', $originalUser->id)
                      ->where('accepted', true)
                      ->exists();
                  if (!$isOwner && !$isFollower) {
                      $post->repost = null;
                  }
              }
          }
          return $post;
      });
  }


    $suggestedUsers = [];
    if ($followingIds->isEmpty()) {
        $suggestedUsers = User::where('id', '!=', $user->id)
            ->latest()
            ->take(20)
            ->get(['id', 'name', 'username', 'avatar']);
    }

     $operators = ['+', '-', '*', '/'];
$a = rand(1, 10);
$b = rand(1, 10);
$op = $operators[array_rand($operators)];

if ($op === '/') {
    $a = $a * $b; // تقسیم صحیح
}

$captchaQuestion = "$a $op $b";
$captchaAnswer = eval("return $captchaQuestion;");

    return Inertia::render('Dashboard', [
        'followedPosts' => $followedPosts,
        'explorerPosts' => $explorerPosts,
        'suggestedUsers' => $suggestedUsers,
         'captcha' => [
        'question' => $captchaQuestion,
        'answer' => $captchaAnswer,
    ],
    ]);
}

    
    
}

