<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

// Controllers
use App\Http\Controllers\{
    ProfileController,
    MessageController,
    PostController,
    CommentController,
    CommentLikeController,
    ReportController,
    LikeController,
    NotificationController,
    FollowController,
    DashboardController,
    HashtagController,
    MessageReactionController,
    Auth\SocialiteController,
    PwaController
};
use App\Http\Controllers\Admin\{
    ReportAdminController,
    AdminBaseController
};

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');
/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
Route::get('/manifest.json', [PwaController::class, 'manifest'])->name('pwa.manifest');

Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);

Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/comments', [PostController::class, 'loadComments']);
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::get('/{username}/posts', [ProfileController::class, 'loadPosts']);
Route::get('/hashtag/{name}', [HashtagController::class, 'show'])->name('hashtag.show');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
        Route::post('/upload', [ProfileController::class, 'upload'])->name('upload');
        Route::post('/update-image', [ProfileController::class, 'updateImage'])->name('update-image');
        Route::post('/delete-image', [ProfileController::class, 'deleteImage'])->name('delete-image');
        Route::post('/image/delete', [ProfileController::class, 'deleteImage']); // duplicated
        Route::post('/notifications', [ProfileController::class, 'updateNotifications'])->name('notifications');
    });

    // Posts
    Route::prefix('posts')->name('posts.')->group(function () {
        Route::get('/', [PostController::class, 'index'])->name('index');
        Route::get('/create', fn () => Inertia::render('Posts/Create'))->name('create');
        Route::post('/', [PostController::class, 'store']);
        Route::get('/{post}/edit', [PostController::class, 'edit'])->name('edit');
        Route::put('/{post}', [PostController::class, 'update'])->name('update');
        Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');
        Route::post('/{post}/comments', [CommentController::class, 'store']);
        Route::post('/{post}/like', [LikeController::class, 'store']);
        Route::post('/{id}/repost', [PostController::class, 'repost'])->name('repost');
    });

    // Comments
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggle']);

    // Chat
    Route::prefix('chat')->name('chat.')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('index');
        Route::get('/{user:username}', [MessageController::class, 'show'])->name('show');
        Route::get('/place/{name}', [MessageController::class, 'placechat'])->name('place');
        Route::get('/place/{name}/json', [MessageController::class, 'placechatJson']);
        Route::post('/send', [MessageController::class, 'store'])->name('store');
        Route::get('/{user}/json', [MessageController::class, 'fetchJson']);
        Route::put('/message/{message}', [MessageController::class, 'update'])->name('update');
        Route::delete('/message/{message}', [MessageController::class, 'destroy'])->name('destroy');
        Route::post('/seen/{user}', [MessageController::class, 'markSeen'])->name('seen');
        Route::post('/message/{message}/react', [MessageReactionController::class, 'store']);
    });

    // Follow
    Route::post('/follow/{user:username}', [FollowController::class, 'toggle'])->name('follow.toggle');
    Route::post('/ajax/follow/{user:username}', [FollowController::class, 'ajaxToggle'])->name('follow.ajax');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);

    // Utilities
    Route::post('/username-check', function (Request $request) {
        $request->validate(['username' => 'required|string|min:4|max:222']);
        $exists = User::where('username', $request->username)
            ->where('id', '!=', auth()->id())->exists();
        return response()->json(['available' => !$exists]);
    })->name('username.check');
});

/*
|--------------------------------------------------------------------------
| Admin Panel Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/panel', [AdminBaseController::class, 'index'])->name('index');
    Route::get('/users', [AdminBaseController::class, 'userList'])->name('users.index');
    Route::delete('/users/{id}', [AdminBaseController::class, 'destroyUser'])->name('users.destroy');
    Route::post('/users/{id}/make-admin', [AdminBaseController::class, 'makeAdmin'])->name('users.makeAdmin');

    Route::get('/reports', [ReportAdminController::class, 'index'])->name('reports.index');
    Route::delete('/reports/{report}/delete-post', [ReportAdminController::class, 'deletePost'])->name('reports.delete-post');

    Route::get('/setting', [AdminBaseController::class, 'setting'])->name('setting.index');
    Route::post('/upload-logo', [AdminBaseController::class, 'upload_logo'])->name('upload-logo');
    Route::post('/settings/update-google', [AdminBaseController::class, 'updateGoogle'])->name('settings.update-google');
    Route::post('/settings/update-app-name', [AdminBaseController::class, 'updateAppName']);
    Route::post('/settings/update-mail', [AdminBaseController::class, 'updateMailSettings']);
    Route::post('/settings/update-pwa', [AdminBaseController::class, 'updatePWA']);
    Route::post('/upload-pwa-icon', [AdminBaseController::class, 'uploadPwaIcon']);
});


Route::get('/{username}', [ProfileController::class, 'show_profile'])->name('show_profile');
