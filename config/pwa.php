<?php

return [
    'install-button' => env('PWA_INSTALL_BUTTON', true), 
    
    'manifest' => [
        'name' => env('PWA_NAME', 'Laravel PWA'),
        'short_name' => env('PWA_SHORT_NAME', 'LPT'),
        'background_color' => env('PWA_BACKGROUND_COLOR', '#6777ef'),
        'display' => env('PWA_DISPLAY', 'fullscreen'),
        'description' => env('PWA_DESCRIPTION', 'A Progressive Web Application setup for Laravel projects.'),
        'theme_color' => env('PWA_THEME_COLOR', '#6777ef'),
        'icons' => [
            [
                'src' => env('PWA_ICON', 'pwa.png'), 
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
        ],
    ],

    'debug' => env('APP_DEBUG', false),
];
