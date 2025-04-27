<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = $_POST['db_host'] ?? '127.0.0.1';
    $dbName = $_POST['db_name'] ?? '';
    $dbUser = $_POST['db_user'] ?? '';
    $dbPass = $_POST['db_pass'] ?? '';
    $adminEmail = $_POST['admin_email'] ?? '';
    $adminPassword = $_POST['admin_password'] ?? '';

    $basePath = dirname(__DIR__);
    $envPath = $basePath . '/.env';

    // Update .env
    $env = file_get_contents($envPath);
    $env = preg_replace('/DB_HOST=.*/', "DB_HOST={$dbHost}", $env);
    $env = preg_replace('/DB_DATABASE=.*/', "DB_DATABASE={$dbName}", $env);
    $env = preg_replace('/DB_USERNAME=.*/', "DB_USERNAME={$dbUser}", $env);
    $env = preg_replace('/DB_PASSWORD=.*/', "DB_PASSWORD={$dbPass}", $env);
    file_put_contents($envPath, $env);

    // Set runtime environment variables
    putenv("DB_HOST=$dbHost");
    putenv("DB_DATABASE=$dbName");
    putenv("DB_USERNAME=$dbUser");
    putenv("DB_PASSWORD=$dbPass");

    // Run CLI commands without bootstrapping HTTP Kernel
    chdir($basePath);

    // 1. Clear configs and caches
    shell_exec('php artisan config:clear');
    shell_exec('php artisan cache:clear');
    shell_exec('php artisan route:clear');
    shell_exec('php artisan view:clear');

    // 2. Migrate database
    shell_exec('php artisan migrate --force');

    // 3. Seed database (optional)
    if (file_exists($basePath . '/database/seeders/DatabaseSeeder.php')) {
        shell_exec('php artisan db:seed --force');
    }

    // 4. Manually create admin user
    require_once $basePath . '/vendor/autoload.php';
    $app = require_once $basePath . '/bootstrap/app.php';

    $app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

    $userModel = App\Models\User::class;

    $userModel::updateOrCreate(
        ['email' => $adminEmail],
        [
            'name' => 'Admin',
            'password' => bcrypt($adminPassword),
            'is_admin' => 1,
            'username' => 'administrator',
        ]
    );

    // Remove the installer file
    @unlink(__FILE__);

    // Success message
    echo "<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<title>Laravel Installed</title>
<script src='https://cdn.tailwindcss.com'></script>
</head>
<body class='bg-green-100 flex items-center justify-center min-h-screen'>
<div class='bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center'>
<h1 class='text-3xl font-bold text-green-600 mb-4'>🎉 Installation Complete!</h1>
<p class='mb-6 text-gray-700'>Laravel has been installed successfully!</p>
<a href='/' class='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'>Go to Website</a>
</div>
</body>
</html>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Laravel Setup</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">🚀 Laravel Initial Setup</h1>
    <form method="POST" action="install.php" class="space-y-4">
      <input type="text" name="db_host" placeholder="DB Host" value="127.0.0.1" class="w-full px-3 py-2 border rounded" />
      <input type="text" name="db_name" placeholder="DB Name" class="w-full px-3 py-2 border rounded" />
      <input type="text" name="db_user" placeholder="DB User" class="w-full px-3 py-2 border rounded" />
      <input type="password" name="db_pass" placeholder="DB Password" class="w-full px-3 py-2 border rounded" />
      <hr class="my-2">
      <input type="email" name="admin_email" placeholder="Admin Email" class="w-full px-3 py-2 border rounded" />
      <input type="password" name="admin_password" placeholder="Admin Password" class="w-full px-3 py-2 border rounded" />
      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Install Laravel</button>
    </form>
  </div>
</body>
</html>
