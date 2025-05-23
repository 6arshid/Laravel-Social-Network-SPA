<?php

// database/seeders/PageSeeder.php
namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run()
    {
        Page::create([
            'title'   => 'About Us',
            'slug'    => 'about',
            'content' => 'This is the content of the About Us page.',
            'lang'    => 'en',
        ]);

        Page::create([
            'title'   => 'Contact Us',
            'slug'    => 'contact',
            'content' => 'This is the content of the Contact Us page.',
            'lang'    => 'en',
        ]);
    }
}
