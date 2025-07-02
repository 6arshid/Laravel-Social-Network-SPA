<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use App\Models\User;

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
            'admin_name' => 'required',
            'admin_email' => 'required|email',
            'admin_username' => 'required',
            'admin_password' => 'required',
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

        Artisan::call('migrate', ['--force' => true]);
        Artisan::call('db:seed', ['--force' => true]);

        User::create([
            'name' => $request->admin_name,
            'email' => $request->admin_email,
            'username' => $request->admin_username,
            'password' => Hash::make($request->admin_password),
            'is_admin' => true,
        ]);

        File::put(storage_path('installed'), now()->toDateTimeString());

        return redirect($request->root());
    }
}
