<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\DB;

class FollowController extends Controller
{
public function toggle(User $user)
{
    if (auth()->id() === $user->id) {
        return back()->withErrors(['message' => 'You cannot follow yourself.']);
    }

    $authUser = auth()->user();

    $existingFollow = DB::table('follows')
        ->where('follower_id', $authUser->id)
        ->where('following_id', $user->id)
        ->first();

    if ($existingFollow) {
        DB::table('follows')->where('id', $existingFollow->id)->delete();
    } else {
        DB::table('follows')->insert([
            'follower_id' => $authUser->id,
            'following_id' => $user->id,
            'accepted' => !$user->is_private,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($user->is_private) {
            NotificationHelper::send(
                $user->id,
                "{$authUser->name} sent you a follow request.",
                null,
                'follow_request',
                ['follower_id' => $authUser->id]
            );
        } else {
            NotificationHelper::send(
                $user->id,
                "{$authUser->name} started following you.",
                route('show_profile', $authUser->username),
                'follow',
                ['follower_id' => $authUser->id]
            );
        }
    }

    return back();
}

public function ajaxToggle(User $user): JsonResponse
{
    $authUser = auth()->user();

    if ($authUser->id === $user->id) {
        return response()->json(['error' => 'Cannot follow yourself.'], 403);
    }

    $existingFollow = DB::table('follows')
        ->where('follower_id', $authUser->id)
        ->where('following_id', $user->id)
        ->first();

    if ($existingFollow) {
        DB::table('follows')->where('id', $existingFollow->id)->delete();
        return response()->json(['status' => 'unfollowed']);
    } else {
        DB::table('follows')->insert([
            'follower_id' => $authUser->id,
            'following_id' => $user->id,
            'accepted' => !$user->is_private,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($user->is_private) {
            \App\Helpers\NotificationHelper::send(
                $user->id,
                "{$authUser->name} sent you a follow request.",
                null,
                'follow_request',
                ['follower_id' => $authUser->id]
            );
            return response()->json(['status' => 'request_sent']);
        } else {
            \App\Helpers\NotificationHelper::send(
                $user->id,
                "{$authUser->name} started following you.",
                route('show_profile', $authUser->username),
                'follow',
                ['follower_id' => $authUser->id]
            );
            return response()->json(['status' => 'followed']);
        }
    }
}



public function acceptRequest(Request $request, User $user)
{
    $authUser = auth()->user();

    if ($authUser->id !== $user->id) {
        abort(403);
    }

    $followerId = $request->input('follower_id');

    DB::table('follows')
        ->where('follower_id', $followerId)
        ->where('following_id', $authUser->id)
        ->update(['accepted' => true]);

    return response()->json(['status' => 'accepted']);
}

public function rejectRequest(Request $request, User $user)
{
    $authUser = auth()->user();

    if ($authUser->id !== $user->id) {
        abort(403);
    }

    $followerId = $request->input('follower_id');

    DB::table('follows')
        ->where('follower_id', $followerId)
        ->where('following_id', $authUser->id)
        ->delete();

    return response()->json(['status' => 'rejected']);
}


}
