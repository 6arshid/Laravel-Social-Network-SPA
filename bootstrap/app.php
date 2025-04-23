<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // افزودن middlewareهای مورد نیاز برای لایه وب
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckForInstallation::class,
            \App\Http\Middleware\VerifyCsrfToken::class, 
            \Illuminate\Routing\Middleware\SubstituteBindings::class,



        ]);

        // تعریف alias برای middleware سفارشی
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
        ]);
        $middleware->group('install', [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            // بدون session و csrf!
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
