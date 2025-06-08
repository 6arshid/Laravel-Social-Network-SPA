<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RootController extends Controller
{
    public function users(Request $request)
{
    $authUser = auth()->user();
    $query = User::query();

    if ($authUser) {
        $blockedIds = $authUser->blockedIds()->merge($authUser->blockedByIds());
        $query->where('id', '!=', $authUser->id)
            ->whereNotIn('id', $blockedIds);
    }

    if ($search = $request->search) {
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%$search%")
              ->orWhere('username', 'like', "%$search%");
        });
    }

    $users = $query
        ->select('id', 'name', 'username', 'avatar')
        ->paginate(10)
        ->withQueryString();

    $followingIds = $authUser ? $authUser->followings->pluck('id') : [];

    return Inertia::render('Users/Index', [
        'users' => $users,
        'following' => $followingIds,
    ]);
}
}

