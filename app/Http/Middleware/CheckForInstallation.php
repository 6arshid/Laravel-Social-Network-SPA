<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\File;

class CheckForInstallation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        $needsInstall = config('database.connections.mysql.database') === 'shz_mobile'
            && !File::exists(storage_path('installed'));

        if ($needsInstall && !$request->is('*install*')) {
            // Build the install URL using the scheme, host, and base path
            // so that nested subdirectory deployments redirect correctly.
            $installUrl = $request->getSchemeAndHttpHost().$request->getBasePath().'/install';
            return redirect()->to($installUrl);
        }

        return $next($request);
    }
}
