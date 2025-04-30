<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReservedUsernameRequest;
use App\Models\UsernameUnregister;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;

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
    private function getLatestEnvValue($key, $default = null)
    {
        $envPath = base_path('.env');
    
        if (!file_exists($envPath)) {
            return $default;
        }
    
        $envLines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
        foreach ($envLines as $line) {
            if (strpos(trim($line), "{$key}=") === 0) {
                return trim(substr($line, strlen($key) + 1));
            }
        }
    
        return $default;
    }
    public function makeAdmin($id)
    {
        $user = User::findOrFail($id);
        $user->is_admin = true;
        $user->save();

        return back()->with('message', 'User is now an admin.');
    }
    public function setting(){
        return Inertia::render('Admin/Setting', [
            'google' => [
                'client_id' => env('GOOGLE_CLIENT_ID'),
                'client_secret' => env('GOOGLE_CLIENT_SECRET'),
                'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
            ],
            'pwa' => [
                'install_button' => env('PWA_INSTALL_BUTTON', false),
                'name' => env('PWA_NAME'),
                'short_name' => env('PWA_SHORT_NAME'),
                'background_color' => env('PWA_BACKGROUND_COLOR'),
                'display' => env('PWA_DISPLAY'),
                'description' => env('PWA_DESCRIPTION'),
                'theme_color' => env('PWA_THEME_COLOR'),
                'icon' => env('PWA_ICON'),
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
           'max_upload_size' => $this->getLatestEnvValue('MAX_UPLOAD_SIZE', 2048),
        ]);
    }
    
    public function upload_logo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:png,jpg,jpeg|max:'. env('MAX_UPLOAD_SIZE'),
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
    public function updatePWA(Request $request)
    {
        $request->validate([
            'install_button' => 'required|boolean',
            'name' => 'required|string',
            'short_name' => 'required|string',
            'background_color' => 'required|string',
            'display' => 'required|string',
            'description' => 'required|string',
            'theme_color' => 'required|string',
            'icon' => 'required|string',
        ]);

        $this->setEnv([
            'PWA_INSTALL_BUTTON' => $request->install_button ? 'true' : 'false',
            'PWA_NAME' => $request->name,
            'PWA_SHORT_NAME' => $request->short_name,
            'PWA_BACKGROUND_COLOR' => $request->background_color,
            'PWA_DISPLAY' => $request->display,
            'PWA_DESCRIPTION' => $request->description,
            'PWA_THEME_COLOR' => $request->theme_color,
            'PWA_ICON' => $request->icon,
        ]);

        \Artisan::call('config:clear');
        \Artisan::call('cache:clear');

        return back()->with('success', 'PWA settings updated.');
    }
    public function uploadPwaIcon(Request $request)
    {
        $request->validate([
            'icon' => 'required|image|mimes:png,jpg,jpeg,svg,ico|max:'. env('MAX_UPLOAD_SIZE'),
        ]);

        $icon = $request->file('icon');
        $icon->move(public_path(), 'pwa.png');

        return back()->with('success', 'PWA icon uploaded.');
    }
    public function usernameunregister(){
        $usernames = UsernameUnregister::orderByDesc('created_at')->get();

        return Inertia::render('Admin/UsernameUnregister', [
            'reservedUsernames' => $usernames,
        ]);
    }
    public function usernameunregisterstore(StoreReservedUsernameRequest $request)
    {
        UsernameUnregister::create([
            'username' => strtolower($request->username),
        ]);

        return redirect()->route('admin.usernameunregister.index')->with('success', 'Username has been reserved.');
    }
    public function updateMaxUpload(Request $request)
{

    $request->validate([
        'max_upload_size' => 'required|numeric|min:1'
    ]);

    $newValue = $request->input('max_upload_size');

    // مسیر فایل env
    $envPath = base_path('.env');
    $key = 'MAX_UPLOAD_SIZE';

    // مقدار موجود را جایگزین کن، یا اضافه کن اگر نبود
    if (File::exists($envPath)) {
        $env = File::get($envPath);

        if (str_contains($env, $key . '=')) {
            // جایگزین کن
            $env = preg_replace("/^{$key}=.*/m", "{$key}={$newValue}", $env);
        } else {
            // اضافه کن
            $env .= "\n{$key}={$newValue}";
        }

        File::put($envPath, $env);
    }

    return back()->with('success', 'Max upload size updated!');
}
    
}
