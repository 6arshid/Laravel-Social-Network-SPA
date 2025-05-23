<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // if (!Schema::hasTable('users')) {
        //     config(['app.needs_installation' => true]);
        // } else {
        //     config(['app.needs_installation' => false]);
        // }
    }
    protected $policies = [
        \App\Models\Comment::class => \App\Policies\CommentPolicy::class,
        \App\Models\Post::class => \App\Policies\PostPolicy::class,

    ];
}
