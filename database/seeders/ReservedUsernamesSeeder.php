<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UsernameUnregister;

class ReservedUsernamesSeeder extends Seeder
{
    public function run(): void
    {
        $usernames = [
            'root',
            'support',
            'help',
            'info',
            'contact',
            'username',
            'user',
            'users',
            'profile',
            'settings',
            'account',
            'dashboard',
            'home',
            'login',
            'register',
            'logout',
            'forgot-password',
            'reset-password',
            'verify-email',
            'email',
            'chat',
            'system',
            'api',
            'webmaster',
        ];

        foreach ($usernames as $username) {
            UsernameUnregister::firstOrCreate([
                'username' => strtolower($username),
            ]);
        }
    }
}

