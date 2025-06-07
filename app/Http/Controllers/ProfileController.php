<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver; 
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // بالای فایل برای اطمینان

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'blockedUsers' => $request->user()->blocks()->get(['id','name','username','avatar']),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image'],
            'type' => ['required', 'in:avatar,cover'],
        ]);

        $image = $request->file('image');
        $type = $request->type;

        $sizes = [
            'avatar' => [300, 300],
            'cover' => [820, 360],
        ];

        $filename = $type . '_' . auth()->id() . '.' . $image->getClientOriginalExtension();
        $directory = storage_path('app/public/profile');
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory . '/' . $filename;

        $manager = new ImageManager(new GdDriver());
        $img = $manager->read($image->getRealPath());

        $img->cover($sizes[$type][0], $sizes[$type][1]);

        $img->toJpeg()->save($path);

        auth()->user()->update([
            $type => 'profile/' . $filename,
        ]);

        return back()->with('success', 'Image uploaded successfully.');
    }

    public function deleteImage(Request $request)
    {
        $request->validate([
            'type' => ['required', 'in:avatar,cover'],
        ]);

        $user = $request->user();
        $field = $request->type;

        if ($user->$field) {
            $path = storage_path('app/public/' . $user->$field);
            if (file_exists($path)) {
                unlink($path);
            }

            $user->update([
                $field => null,
            ]);
        }

        return back()->with('success', 'Image deleted successfully.');
    }

   public function show_profile($username, Request $request)
{
    \App\Helpers\StatisticHelper::record('profile_visited');

    $user = User::where('username', $username)->firstOrFail();
    $authUser = auth()->user();

    // اگر حساب خصوصی است و کاربر دسترسی ندارد
    $isAcceptedFollower = false;
    if ($authUser) {
        $isAcceptedFollower = \DB::table('follows')
            ->where('follower_id', $authUser->id)
            ->where('following_id', $user->id)
            ->where('accepted', true)
            ->exists();
    }

    $isOwner = $authUser && $authUser->id === $user->id;

    if ($user->is_private && !$isOwner && !$isAcceptedFollower) {
        return Inertia::render('Profile/Private', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'avatar' => $user->avatar,
            ],
            'isFollowing' => $authUser ? $authUser->isFollowing($user) : false,
            'hasPendingRequest' => $authUser ? \DB::table('follows')
                ->where('follower_id', $authUser->id)
                ->where('following_id', $user->id)
                ->where('accepted', false)
                ->exists() : false,
        ]);
    }

    $posts = $user->posts()
        ->with([
            'media',
            'likes',
            'user',
            'repost' => fn($q) => $q->with('user', 'media'),
        ])
        ->latest()
        ->paginate(5)
        ->withQueryString();
    $operators = ['+', '-', '*', '/'];
$a = rand(1, 10);
$b = rand(1, 10);
$op = $operators[array_rand($operators)];

if ($op === '/') {
    $a = $a * $b; // تقسیم صحیح
}

$captchaQuestion = "$a $op $b";
$captchaAnswer = eval("return $captchaQuestion;");
    return Inertia::render('Profile/Show', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'avatar' => $user->avatar,
            'cover' => $user->cover,
            'bio' => $user->bio,
            'location' => $user->location,
            'website' => $user->website,
            'phone' => $user->phone,
            'instagram' => $user->instagram,
            'twitter' => $user->twitter,
            'facebook' => $user->facebook,
            'linkedin' => $user->linkedin,
            'github' => $user->github,
            'tiktok' => $user->tiktok,
            'snapchat' => $user->snapchat,
            'youtube' => $user->youtube,
            'pinterest' => $user->pinterest,
            'whatsapp' => $user->whatsapp,
            'telegram' => $user->telegram,
        ],
        'appName' => config('app.name'),
        'posts' => $posts,
        'isOwner' => $isOwner,
        'isFollowing' => $authUser ? $authUser->isFollowing($user) : false,
        'isBlocked' => $authUser ? $authUser->hasBlocked($user) : false,
               'captcha' => [
        'question' => $captchaQuestion,
        'answer' => $captchaAnswer,
    ],
    ]);
}

    

    public function updateImage(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'file' => 'required|image|max:'. env('MAX_UPLOAD_SIZE'),
            'type' => 'required|in:avatar,cover',
        ]);

        $type = $request->input('type');

        if ($type === 'avatar') {
            if ($user->avatar) Storage::delete('public/' . $user->avatar);
            $user->avatar = $request->file('file')->store('avatars', 'public');
        }

        if ($type === 'cover') {
            if ($user->cover) Storage::delete('public/' . $user->cover);
            $user->cover = $request->file('file')->store('covers', 'public');
        }

        $user->save();
        return back();
    }
    public function updateNotifications(Request $request)
    {
        $request->validate([
            'disable_notifications' => 'required|boolean',
        ]);

        $user = Auth::user();
        $user->disable_notifications = $request->disable_notifications;
        $user->save();

        return back()->with('status', 'Notification settings updated.');
    }
    public function followers($username)
{
    $user = User::where('username', $username)->firstOrFail();

    if (auth()->id() !== $user->id) {
        abort(403);
    }

    $followers = $user->followers()->paginate(20);

    return Inertia::render('Profile/Followers', [
        'user' => $user,
        'followers' => $followers,
    ]);
}

public function following($username)
{
    $user = User::where('username', $username)->firstOrFail();

    if (auth()->id() !== $user->id) {
        abort(403);
    }

    $following = $user->following()->paginate(20);

    return Inertia::render('Profile/Following', [
        'user' => $user,
        'following' => $following,
    ]);
}
}
