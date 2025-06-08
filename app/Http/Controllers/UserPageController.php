<?php

namespace App\Http\Controllers;

use App\Models\UserPage;
use App\Models\PageLike;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

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
        return Inertia::render('UserPages/Show', [
            'page' => $page,
            'isLiked' => $isLiked,
            'categories' => config('user_pages.categories'),
            'posts' => $posts,
        ]);
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
