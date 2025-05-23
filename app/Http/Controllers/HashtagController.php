<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Inertia\Inertia;

class HashtagController extends Controller
{
    public function show($name)
{
    $hashtag = '#' . $name;

    $posts = Post::with([
            'user',
            'media',
            'likes',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->where('content', 'like', "%$hashtag%")
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Posts/Hashtag', [
        'hashtag' => $name,
        'posts' => $posts,
    ]);
}
}
