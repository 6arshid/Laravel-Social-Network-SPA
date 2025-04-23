<?php

return [
    'install-button' => true, // Show or hide the install button globally.

    'manifest' => [
        'name' => 'Laravel PWA',
        'short_name' => 'LPT',
        'background_color' => '#6777ef',
        'display' => 'fullscreen',
        'description' => 'A Progressive Web Application setup for Laravel projects.',
        'theme_color' => '#6777ef',
        'icons' => [
            [
                'src' => 'logo.png',
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
        ],
    ],

    'debug' => env('APP_DEBUG', false), // Show or hide console.log in the browser globally.
];