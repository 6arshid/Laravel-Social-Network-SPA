<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
class AdminBaseController extends Controller
{
    public function index(){
        return inertia('Admin/Index');
    }
    public function userList(Request $request)
    {
        $search = $request->input('search');
    
        $users = User::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest() 
            ->paginate(10)
            ->withQueryString();
    
        return inertia('Admin/UserList', [
            'users' => $users,
            'filters' => ['search' => $search],
        ]);
    }
    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('message', 'User and related data deleted successfully.');
    }

    public function makeAdmin($id)
    {
        $user = User::findOrFail($id);
        $user->is_admin = true;
        $user->save();

        return back()->with('message', 'User is now an admin.');
    }
    public function setting(){
        $googleConfig = config('services.google');

        return Inertia::render('Admin/Setting', [
           'google' => [
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => env('GOOGLE_REDIRECT_URI'), // ← این خط مهمه
        ],
        'app_name' => env('APP_NAME'),
        'mail' => [
        'host' => env('MAIL_HOST'),
        'port' => env('MAIL_PORT'),
        'username' => env('MAIL_USERNAME'),
        'password' => env('MAIL_PASSWORD'),
        'from_address' => env('MAIL_FROM_ADDRESS'),
        'from_name' => env('MAIL_FROM_NAME'),
    ],
        ]);
    }
    public function upload_logo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg|max:2048',
        ]);
    
        $logo = $request->file('logo');
    
        // Save as public/logo.png
        $logo->move(public_path(), 'logo.png');
    
        return back()->with('success', 'Logo uploaded successfully.');
    }
    public function updateGoogle(Request $request)
    {
        $request->validate([
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
            'redirect_uri' => 'required|url',
        ]);

        $this->setEnv([
            'GOOGLE_CLIENT_ID' => $request->client_id,
            'GOOGLE_CLIENT_SECRET' => $request->client_secret,
            'GOOGLE_REDIRECT_URI' => $request->redirect_uri,
        ]);

        return back()->with('success', 'Google login information updated.');
    }

    protected function setEnv(array $values)
    {
        $envPath = base_path('.env');
    
        if (!file_exists($envPath) || !is_writable($envPath)) {
            throw new \Exception(".env file not found or is not writable.");
        }
    
        $envContent = file_get_contents($envPath);
    
        foreach ($values as $key => $value) {
            $pattern = "/^{$key}=.*/m";
            $replacement = "{$key}=\"{$value}\"";
    
            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $replacement, $envContent);
            } else {
                // Add at the end if not exists
                $envContent .= "\n{$replacement}";
            }
        }
    
        file_put_contents($envPath, $envContent);
        \Artisan::call('config:clear');
        \Artisan::call('cache:clear');
        \Artisan::call('optimize:clear');
    }
    public function updateAppName(Request $request)
{
    $request->validate([
        'app_name' => 'required|string',
    ]);

    $this->setEnv([
        'APP_NAME' => $request->app_name,
    ]);

    \Artisan::call('config:clear');
    \Artisan::call('cache:clear');

    return back()->with('success', 'App name updated.');
}

public function updateMailSettings(Request $request)
{
    $request->validate([
        'mail_host' => 'required|string',
        'mail_port' => 'required|numeric',
        'mail_username' => 'nullable|string',
        'mail_password' => 'nullable|string',
        'mail_from_address' => 'required|email',
        'mail_from_name' => 'required|string',
    ]);

    $this->setEnv([
        'MAIL_HOST' => $request->mail_host,
        'MAIL_PORT' => $request->mail_port,
        'MAIL_USERNAME' => $request->mail_username ?? 'null',
        'MAIL_PASSWORD' => $request->mail_password ?? 'null',
        'MAIL_FROM_ADDRESS' => $request->mail_from_address,
        'MAIL_FROM_NAME' => $request->mail_from_name,
    ]);

    \Artisan::call('config:clear');
    \Artisan::call('cache:clear');

    return back()->with('success', 'Mail settings updated.');
}
    
    
}
