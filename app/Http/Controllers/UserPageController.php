<?php

namespace App\Http\Controllers;

use App\Models\UserPage;
use App\Models\PageLike;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Illuminate\Support\Facades\Storage;

class UserPageController extends Controller
{
    public function index(Request $request)
    {
        $query = UserPage::query();
        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }
        $pages = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('UserPages/Index', [
            'pages' => $pages,
            'filters' => $request->only('search'),
            'categories' => config('user_pages.categories'),
        ]);
    }

    public function create()
    {
        return Inertia::render('UserPages/Create', [
            'categories' => config('user_pages.categories'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'public_email' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
        ]);
        $data['user_id'] = Auth::id();
        $data['slug'] = Str::slug($data['name']) . '-' . uniqid();
        $page = UserPage::create($data);
        return redirect()->route('user_pages.show', $page->slug);
    }

    public function show(UserPage $page)
    {
        $page->loadCount('likes');
        $isLiked = false;
        if ($user = Auth::user()) {
            $isLiked = $page->likes()->where('user_id', $user->id)->exists();
        }
        $posts = Post::with(['user', 'media', 'page'])
            ->where('user_page_id', $page->id)
            ->latest()
            ->paginate(5)
            ->withQueryString();
        $operators = ['+', '-', '*', '/'];
        $a = rand(1, 10);
        $b = rand(1, 10);
        $op = $operators[array_rand($operators)];
        if ($op === '/') {
            $a = $a * $b;
        }
        $captchaQuestion = "$a $op $b";
        $captchaAnswer = eval("return $captchaQuestion;");

        return Inertia::render('UserPages/Show', [
            'page' => $page,
            'isLiked' => $isLiked,
            'posts' => $posts,
            'captcha' => [
                'question' => $captchaQuestion,
                'answer' => $captchaAnswer,
            ],
        ]);
    }

    public function edit(UserPage $page)
    {
        if ($page->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('UserPages/Edit', [
            'page' => $page,
            'categories' => config('user_pages.categories'),
        ]);
    }

    public function update(Request $request, UserPage $page)
    {
        if ($page->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'website' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:255',
            'public_email' => 'nullable|email|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $page->update($data);

        return redirect()->route('user_pages.show', $page->slug);
    }

    public function like(UserPage $page)
    {
        $user = Auth::user();
        if (!$user) {
            abort(401);
        }
        $like = PageLike::where('user_page_id', $page->id)
            ->where('user_id', $user->id)
            ->first();
        if ($like) {
            $like->delete();
        } else {
            PageLike::create([
                'user_page_id' => $page->id,
                'user_id' => $user->id,
            ]);
        }
        return back();
    }

    public function upload(Request $request, UserPage $page)
    {
        if ($page->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'image' => ['required', 'image'],
            'type' => ['required', 'in:avatar,cover'],
        ]);

        $image = $request->file('image');
        $type = $request->type;

        $sizes = [
            'avatar' => [400, 400],
            'cover' => [851, 315],
        ];

        $filename = $type . '_' . $page->id . '.' . $image->getClientOriginalExtension();
        $directory = storage_path('app/public/pages');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory . '/' . $filename;

        $manager = new ImageManager(new GdDriver());
        $img = $manager->read($image->getRealPath());
        $img->cover($sizes[$type][0], $sizes[$type][1]);
        $img->toJpeg()->save($path);

        $page->update([
            $type => 'pages/' . $filename,
        ]);

        return back();
    }

    public function deleteImage(Request $request, UserPage $page)
    {
        if ($page->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'type' => ['required', 'in:avatar,cover'],
        ]);

        $field = $request->type;
        if ($page->$field) {
            Storage::delete('public/' . $page->$field);
            $page->update([$field => null]);
        }

        return back();
    }

    public function category($slug)
    {
        $name = str_replace('-', ' ', $slug);
        $pages = UserPage::where('category', $name)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('UserPages/Category', [
            'category' => $name,
            'pages' => $pages,
        ]);
    }
}
