<?php

// app/Http/Controllers/PageController.php
namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;

class PageController extends Controller
{
    public function show($slug)
    {
        $locale = app()->getLocale();
    
        $page = Page::where('slug', $slug)
                    ->where('lang', $locale)
                    ->firstOrFail();
    
        return Inertia::render('Page/Show', [
            'page' => $page
        ]);
    }
    
}

