<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;
use App\Models\UserPage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use DB;
use Illuminate\Support\Str;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
{
    $authUser = auth()->user();

    $posts = Post::with([
            'media',
            'user',
            'page',
            'repost' => fn ($q) => $q->with(['user', 'media', 'page']),
        ])
        ->where('user_id', $authUser->id)
        ->latest()
        ->paginate(5)
        ->withQueryString();

    // فیلتر نمایش repost فقط برای پست‌های مجاز و کاربرانی که بلاک نشده‌اند
    $posts->getCollection()->transform(function ($post) use ($authUser) {
        $repost = $post->repost;

        if ($repost) {
            $originalUser = $repost->user;

            // اگر کاربر اصلی بلاک شده بود، repost نمایش داده نشود
            if ($authUser->hasBlocked($originalUser) || $authUser->isBlockedBy($originalUser)) {
                $post->repost = null;
                return $post;
            }

            if ($originalUser->is_private) {
                $isOwner = $authUser->id === $originalUser->id;

                $isFollower = DB::table('follows')
                    ->where('follower_id', $authUser->id)
                    ->where('following_id', $originalUser->id)
                    ->where('accepted', true)
                    ->exists();

                if (!$isOwner && !$isFollower) {
                    $post->repost = null; // مخفی کردن repost
                }
            }
        }

        return $post;
    });

    return Inertia::render('Posts/Index', [
        'posts' => $posts,
    ]);
}



    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'repost_id' => 'nullable|exists:posts,id',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:' . env('MAX_UPLOAD_SIZE'),
        ]);

    $authUser = auth()->user();

    // اگر repost هست، بررسی کن که مجاز هست یا نه
    if (!empty($data['repost_id'])) {
        $original = Post::with('user')->findOrFail($data['repost_id']);
        $owner = $original->user;

        if ($owner->is_private && $owner->id !== $authUser->id) {
            $isFollower = DB::table('follows')
                ->where('follower_id', $authUser->id)
                ->where('following_id', $owner->id)
                ->where('accepted', true)
                ->exists();

            if (!$isFollower) {
                return redirect()->back()->withErrors(['error' => 'This post is private and cannot be reposted.']);
            }
        }
    }

    // پست جدید ایجاد شود
    $post = Post::create([
        'user_id' => $authUser->id,
        'content' => $data['content'],
        'repost_id' => $data['repost_id'] ?? null,
    ]);

    // اگر فایل داشت
    if ($request->hasFile('media')) {
        foreach ($request->file('media') as $file) {
            $path = $file->store('posts', 'public');
            $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

            $post->media()->create([
                'file_path' => $path,
                'type' => $type,
            ]);
        }
    }

        return redirect()->route('posts.show', $post->id);
    }

    public function storeForPage(Request $request, UserPage $page)
    {
        if ($page->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'content' => 'required|string',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:' . env('MAX_UPLOAD_SIZE'),
        ]);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'user_page_id' => $page->id,
            'content' => $data['content'],
        ]);

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('posts', 'public');
                $type = str_contains($file->getMimeType(), 'video') ? 'video' : 'image';

                $post->media()->create([
                    'file_path' => $path,
                    'type' => $type,
                ]);
            }
        }

        return redirect()->route('posts.show', $post->id);
    }


    public function edit(Post $post)
    {
        $this->authorize('update', $post); // 🔐 check owner

        return Inertia::render('Posts/Edit', [
            'post' => $post
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validate([
            'content' => 'required|string',
        ]);

        $post->update($data);

        return redirect()->route('posts.show', $post);
    }

    public function destroy(Post $post)
{
    $this->authorize('delete', $post);

    // Delete related media (image/video)
    if ($post->media) {
        foreach ($post->media as $media) {
            $filePath = storage_path('app/public/' . $media->file_path);
            if (file_exists($filePath)) {
                unlink($filePath); // Delete file from storage
            }
        }
    }

    // Delete the post itself
    $post->delete();

    return redirect()->route('welcome'); // Redirect to home or any other route
}

private function getSimilarPosts(Post $post)
{
    $authUser = auth()->user();
    $blockedIds = $authUser ? $authUser->blockedIds()->merge($authUser->blockedByIds()) : collect();

    return Post::where('id', '!=', $post->id)
        ->whereHas('user', function ($query) use ($authUser) {
            $query->where(function ($q) use ($authUser) {
                $q->where('is_private', false);

                if ($authUser) {
                    $q->orWhereIn('id', function ($sub) use ($authUser) {
                        $sub->select('following_id')
                            ->from('follows')
                            ->where('follower_id', $authUser->id)
                            ->where('accepted', true);
                    });

                    $q->orWhere('id', $authUser->id);
                }
            });
        })
        ->whereNotIn('user_id', $blockedIds)
        ->latest()
        ->take(5)
        ->with(['user', 'media', 'page'])
        ->get();
}

public function show(Request $request, Post $post)
{
    $post->load([
        'media',
        'user',
        'page',
        'likes',
        'repost' => fn ($q) => $q->with('user', 'media', 'page'),
    ]);

    $owner = $post->user;
    $authUser = Auth::user();

    if ($authUser && ($authUser->hasBlocked($owner) || $authUser->isBlockedBy($owner))) {
        abort(403, 'You are not allowed to view this post.');
    }

    if ($owner->is_private) {
        if (!$authUser) {
            abort(403, 'Login required.');
        }

        if ($authUser->id !== $owner->id) {
            $isFollower = DB::table('follows')
                ->where('follower_id', $authUser->id)
                ->where('following_id', $owner->id)
                ->where('accepted', true)
                ->exists();

            if (!$isFollower) {
                abort(403, 'You are not allowed to view this post.');
            }
        }
    }

    // اگر پست repost باشد و صاحب اصلی بلاک شده یا دسترسی ندارد، آن را مخفی کن
    if ($post->repost) {
        $originalUser = $post->repost->user;

        if ($authUser && ($authUser->hasBlocked($originalUser) || $authUser->isBlockedBy($originalUser))) {
            $post->repost = null;
        } elseif ($originalUser->is_private) {
            if (!$authUser || $authUser->id !== $originalUser->id) {
                $isFollower = $authUser ? DB::table('follows')
                    ->where('follower_id', $authUser->id)
                    ->where('following_id', $originalUser->id)
                    ->where('accepted', true)
                    ->exists() : false;

                if (!$isFollower) {
                    $post->repost = null;
                }
            }
        }
    }

    $post->increment('views');

    $comments = $post->comments()
        ->with([
            'user',
            'likes',
            'replies' => fn($q) => $q->with('user', 'likes')->orderBy('created_at')
        ])
        ->whereNull('parent_id')
        ->latest()
        ->paginate(5)
        ->withQueryString();

    $blockedIds = $authUser ? $authUser->blockedIds()->merge($authUser->blockedByIds()) : collect();

    $similarPosts = Post::where('id', '!=', $post->id)
        ->whereHas('user', function ($query) use ($authUser) {
            $query->where(function ($q) use ($authUser) {
                $q->where('is_private', false);

                if ($authUser) {
                    $q->orWhereIn('id', function ($sub) use ($authUser) {
                        $sub->select('following_id')
                            ->from('follows')
                            ->where('follower_id', $authUser->id)
                            ->where('accepted', true);
                    });

                    $q->orWhere('id', $authUser->id);
                }
            });
        })
        ->whereNotIn('user_id', $blockedIds)
        ->latest()
        ->take(5)
        ->with(['user', 'media'])
        ->get();

    $operators = ['+', '-', '*', '/'];
$a = rand(1, 10);
$b = rand(1, 10);
$op = $operators[array_rand($operators)];

if ($op === '/') {
    $a = $a * $b; // تقسیم صحیح
}

$captchaQuestion = "$a $op $b";
$captchaAnswer = eval("return $captchaQuestion;");

return Inertia::render('Posts/Show', [
    'post' => $post,
    'comments' => $comments,
    'reactions' => $post->likes,
    'similarPosts' => $similarPosts,
    'auth' => [
        'user' => $authUser,
    ],
    'captcha' => [
        'question' => $captchaQuestion,
        'answer' => $captchaAnswer,
    ],
]);
}






public function loadComments(Request $request, Post $post)
{
    $comments = $post->comments()
        ->with([
            'user',
            'likes',
            'replies' => fn($q) => $q->with('user', 'likes')->orderBy('created_at')
        ])
        ->whereNull('parent_id')
        ->latest()
        ->paginate(5);

    return response()->json($comments);
}

public function repost(Request $request, $id)
{
    $request->validate([
        'content' => 'nullable|string|max:1000',
    ]);

    $original = Post::with(['media', 'user'])->findOrFail($id);
    $authUser = auth()->user();
    $owner = $original->user;

    // بررسی محدودیت اکانت خصوصی
    if ($owner->is_private && $authUser->id !== $owner->id) {
        $isFollower = DB::table('follows')
            ->where('follower_id', $authUser->id)
            ->where('following_id', $owner->id)
            ->where('accepted', true)
            ->exists();

        if (!$isFollower) {
            return redirect()->back()->withErrors(['error' => 'This post is private and cannot be reposted.']);
        }
    }

    $post = Post::create([
        'user_id' => $authUser->id,
        'content' => $request->input('content'),
        'repost_id' => $original->id,
    ]);

    foreach ($original->media as $media) {
        $post->media()->create([
            'file_path' => $media->file_path,
            'type' => $media->type,
        ]);
    }

    return redirect()->route('posts.show', $post->id)->with('success', 'Reposted successfully.');
}

}
