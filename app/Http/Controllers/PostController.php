<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Media;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $posts = Post::with('media', 'user')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(5)
            ->withQueryString(); // for pagination link to work
    
        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'media.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:20480'
        ]);
    
        $post = Post::create([
            'user_id' => auth()->id(),
            'content' => $data['content']
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
public function show(Request $request, Post $post)
{
   
    $post->load([
        'media',
        'user',
        'likes',
        'repost' => fn ($q) => $q->with('user', 'media'), 
    ]);
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

    $similarPosts = \App\Models\Post::where('user_id', $post->user_id)
        ->where('id', '!=', $post->id)
        ->latest()
        ->take(10)
        ->get();

    if ($similarPosts->isEmpty()) {
        $similarPosts = \App\Models\Post::where('id', '!=', $post->id)
            ->latest()
            ->take(10)
            ->get();
    }

    return Inertia::render('Posts/Show', [
        'post' => $post,
        'comments' => $comments,
        'reactions' => $post->likes,
        'similarPosts' => $similarPosts,
        'auth' => [
            'user' => Auth::user(),
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

    $original = Post::with('media')->findOrFail($id);

    $post = Post::create([
        'user_id' => auth()->id(),
        'content' => $request->input('content'), // توضیح کاربر
        'repost_id' => $original->id,
    ]);

    // اگر خواستی media هم کپی بشه
    foreach ($original->media as $media) {
        $post->media()->create([
            'file_path' => $media->file_path,
            'type' => $media->type,
        ]);
    }

    return redirect()->route('posts.show', $post->id);
}
}
