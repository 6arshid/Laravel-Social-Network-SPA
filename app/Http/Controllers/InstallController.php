<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class InstallController extends Controller
{
    public function show(Request $request)
    {
        if (File::exists(storage_path('installed'))) {
            return redirect($request->root());
        }
        return inertia('Install');
    }

    public function install(Request $request)
    {
        $request->validate([
            'db_host' => 'required',
            'db_port' => 'required',
            'db_database' => 'required',
            'db_username' => 'required',
            'db_password' => 'nullable',
        ]);

        $envPath = base_path('.env');
        $env = File::exists($envPath) ? File::get($envPath) : File::get(base_path('.env.example'));

        $env = preg_replace('/DB_HOST=.*/', 'DB_HOST='.$request->db_host, $env);
        $env = preg_replace('/DB_PORT=.*/', 'DB_PORT='.$request->db_port, $env);
        $env = preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE='.$request->db_database, $env);
        $env = preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME='.$request->db_username, $env);
        $env = preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD='.$request->db_password, $env);

        File::put($envPath, $env);

        config([
            'database.connections.mysql.host' => $request->db_host,
            'database.connections.mysql.port' => $request->db_port,
            'database.connections.mysql.database' => $request->db_database,
            'database.connections.mysql.username' => $request->db_username,
            'database.connections.mysql.password' => $request->db_password,
        ]);
        DB::purge('mysql');

        Artisan::call('key:generate', ['--force' => true]);
        Artisan::call('config:clear');

        config([
            'database.connections.installer' => [
                'driver' => 'mysql',
                'host' => $request->db_host,
                'port' => $request->db_port,
                'username' => $request->db_username,
                'password' => $request->db_password,
            ],
        ]);
        try {
            DB::connection('installer')->statement('CREATE DATABASE IF NOT EXISTS `'.$request->db_database.'`');
        } catch (\Exception $e) {
            // ignore errors creating database
        }

        DB::reconnect('mysql');
        $sqlFile = public_path('test4.sql');
        if (File::exists($sqlFile)) {
            DB::unprepared(File::get($sqlFile));
            File::delete($sqlFile);
        }

        // create public/storage symlink if it doesn't exist
        $storageLink = public_path('storage');
        if (!File::exists($storageLink)) {
            try {
                @symlink(storage_path('app/public'), $storageLink);
            } catch (\Throwable $e) {
                if (function_exists('exec')) {
                    Artisan::call('storage:link');
                } else {
                    File::copyDirectory(storage_path('app/public'), $storageLink);
                }
            }
        }

        File::put(storage_path('installed'), now()->toDateTimeString());

        return inertia('Installed');
    }
}
