<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
{
    $googleUser = Socialite::driver('google')->stateless()->user();

    $user = User::where('email', $googleUser->getEmail())->first();

    if ($user) {
        Auth::login($user);
    } else {
        // دانلود تصویر آواتار و ذخیره در storage
        $avatarUrl = $googleUser->getAvatar();
        $avatarContents = Http::get($avatarUrl)->body();
        $avatarName = 'avatars/' . Str::uuid() . '.jpg';
        Storage::disk('public')->put($avatarName, $avatarContents);

        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar' => $avatarName, // ✅ مسیر صحیح برای نمایش در مرورگر
            'password' => Hash::make(Str::random(16)),
            'username' => Str::slug($googleUser->getName()) . '-' . Str::random(5),
        ]);

        Auth::login($user);
    }

    return redirect('/dashboard');
}

}
