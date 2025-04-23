<?php

// Very raw standalone Laravel installer – No routes, no middleware, no csrf, no session.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbHost = $_POST['db_host'] ?? '127.0.0.1';
    $dbName = $_POST['db_name'] ?? '';
    $dbUser = $_POST['db_user'] ?? '';
    $dbPass = $_POST['db_pass'] ?? '';
    $adminEmail = $_POST['admin_email'] ?? '';
    $adminPassword = $_POST['admin_password'] ?? '';

    $envPath = dirname(__DIR__) . '/.env';
    $env = file_get_contents($envPath);

    $env = preg_replace("/DB_HOST=.*/", "DB_HOST=$dbHost", $env);
    $env = preg_replace("/DB_DATABASE=.*/", "DB_DATABASE=$dbName", $env);
    $env = preg_replace("/DB_USERNAME=.*/", "DB_USERNAME=$dbUser", $env);
    $env = preg_replace("/DB_PASSWORD=.*/", "DB_PASSWORD=$dbPass", $env);

    file_put_contents($envPath, $env);

    require dirname(__DIR__) . '/vendor/autoload.php';
    $app = require dirname(__DIR__) . '/bootstrap/app.php';

    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

    $kernel->call('config:clear');
    $kernel->call('migrate', ['--force' => true]);

    $userClass = App\Models\User::class;
    $userClass::create([
        'name' => 'Admin',
        'email' => $adminEmail,
        'password' => bcrypt($adminPassword),
        'is_admin' => true,
        'username' => 'admin',
    ]);

    echo "✅ Laravel installed successfully. You may now delete this file.";
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
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Install Laravel</button>
    </form>
  </div>
</body>
</html>
