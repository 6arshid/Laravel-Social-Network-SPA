<?php
namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class PwaController extends Controller
{
    public function manifest(): JsonResponse
    {
        return response()->json([
            'name' => env('PWA_NAME', 'My App'),
            'short_name' => env('PWA_SHORT_NAME', 'MyApp'),
            'start_url' => '/',
            'display' => env('PWA_DISPLAY', 'standalone'),
            'theme_color' => env('PWA_THEME_COLOR', '#000000'),
            'background_color' => env('PWA_BACKGROUND_COLOR', '#ffffff'),
            'description' => env('PWA_DESCRIPTION', 'My awesome PWA'),
            'icons' => [[
                'src' => '/pwa.png?v=' . now()->timestamp,
                'sizes' => '512x512',
                'type' => 'image/png'
            ]]
        ])
        ->header('Content-Type', 'application/manifest+json')
        ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
        
    }
}
