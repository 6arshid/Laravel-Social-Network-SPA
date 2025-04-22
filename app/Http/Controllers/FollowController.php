<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\NotificationHelper;
use Illuminate\Http\JsonResponse;

class FollowController extends Controller
{
    public function toggle(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->withErrors(['message' => 'You cannot follow yourself.']);
        }

        $authUser = auth()->user();

        if ($authUser->isFollowing($user)) {
            $authUser->followings()->detach($user->id);
        } else {
            $authUser->followings()->attach($user->id);

            // ✅ Send notification to the followed user
            NotificationHelper::send(
                $user->id,
                "{$authUser->name} started following you.",
                route('show_profile', $authUser->username) // 🔁 Make sure this route is correct
            );
        }

        return back();
    }
    public function ajaxToggle(User $user): JsonResponse
{
    $authUser = auth()->user();

    if ($authUser->id === $user->id) {
        return response()->json(['error' => 'You cannot follow yourself.'], 403);
    }

    $isFollowing = $authUser->followings()->where('following_id', $user->id)->exists();

    if ($isFollowing) {
        $authUser->followings()->detach($user->id);
        $status = 'unfollowed';
    } else {
        $authUser->followings()->attach($user->id);
        $status = 'followed';
    }

    return response()->json([
        'status' => $status,
        'user_id' => $user->id,
    ]);
}
}
