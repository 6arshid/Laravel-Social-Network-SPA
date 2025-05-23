<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // کاربر لاگین فعلی (مثلاً admin)
        User::factory()->create([
            'name' => 'Admin',
            'username' => 'admin123',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // بقیه کاربران تستی
        User::factory()->count(20)->create();
    }
}
