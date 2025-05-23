<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script>
            window.Laravel = {
                user: @json(auth()->user())
            }
        </script>
            @PwaHead <!-- Add this directive to include the PWA meta tags -->
            <link rel="icon" type="image/png" href="/pwa.png?v={{ now()->timestamp }}">
            <link rel="apple-touch-icon" href="/pwa.png?v={{ now()->timestamp }}">
            <link rel="manifest" href="{{ route('pwa.manifest') }}?v={{ now()->timestamp }}">
            <meta name="theme-color" content="{{ env('PWA_THEME_COLOR', '#000000') }}">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        @RegisterServiceWorkerScript <!-- This registers the service worker -->

    </body>
</html>
