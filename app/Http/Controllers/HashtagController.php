<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Str;
class HashtagController extends Controller
{
    public function show($name)
{
    $hashtag = '#' . $name;

    $authUser = auth()->user();

    $postsQuery = Post::with([
            'user',
            'media',
            'likes',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->where('content', 'like', "%$hashtag%")
        ->latest();

    if ($authUser) {
        $blockedIds = $authUser->blockedIds()->merge($authUser->blockedByIds());
        $postsQuery->whereNotIn('user_id', $blockedIds);
    }

    $posts = $postsQuery->paginate(10)->withQueryString();
   $operators = ['+', '-', '*', '/'];
$a = rand(1, 10);
$b = rand(1, 10);
$op = $operators[array_rand($operators)];

if ($op === '/') {
    $a = $a * $b; // تقسیم صحیح
}

$captchaQuestion = "$a $op $b";
$captchaAnswer = eval("return $captchaQuestion;");
    return Inertia::render('Posts/Hashtag', [
        'hashtag' => $name,
        'posts' => $posts,
               'captcha' => [
        'question' => $captchaQuestion,
        'answer' => $captchaAnswer,
    ],
    ]);
}
}
