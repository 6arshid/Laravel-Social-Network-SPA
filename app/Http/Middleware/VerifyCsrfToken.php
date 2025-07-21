<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        '/install', // Exclude install from CSRF check
        '/install/delete-file', // Allow delete install file without CSRF
    ];
}
