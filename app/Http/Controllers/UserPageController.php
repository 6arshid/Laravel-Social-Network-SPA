<?php

namespace App\Http\Controllers;

use App\Models\UserPage;
use App\Models\PageLike;
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
        ]);
    }

    public function create()
    {
        return Inertia::render('UserPages/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
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
        return Inertia::render('UserPages/Show', [
            'page' => $page,
            'isLiked' => $isLiked,
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
}
