<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
{
    $googleUser = Socialite::driver('google')->stateless()->user();

    // بررسی اینکه کاربر با این ایمیل قبلاً ثبت‌نام کرده یا نه
    $user = User::where('email', $googleUser->getEmail())->first();

    if ($user) {
        // اگر کاربر وجود داشت، لاگینش کن
        Auth::login($user);
    } else {
        $avatarUrl = $googleUser->getAvatar();

        // اگر کاربر جدید بود، اکانت بساز و لاگینش کن
        $user = User::create([
            'name' => $googleUser->getName(),
            'email' => $googleUser->getEmail(),
            'google_id' => $googleUser->getId(),
            'avatar' => $avatarUrl, // 👈 مستقیم ذخیره بشه
            'password' => Hash::make(Str::random(16)),
            'username' => Str::slug($googleUser->getName()) . '-' . Str::random(5),
        ]);

        Auth::login($user);
    }

    return redirect('/dashboard');
}

}
