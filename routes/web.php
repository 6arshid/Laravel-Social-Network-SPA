<?php

use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Admin\ReportAdminController;
use App\Http\Controllers\Admin\AdminBaseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentLikeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HashtagController;
use App\Http\Controllers\MessageReactionController;
use App\Http\Controllers\UserPageController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\PwaController;
use App\Http\Controllers\RootController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\InstallController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\UsernameUnregister;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Route::get('/install', [InstallController::class, 'show'])->name('install.show');
// Route::post('/install', [InstallController::class, 'install'])->name('install.perform');


Route::get('/manifest.json', [PwaController::class, 'manifest'])->name('pwa.manifest');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');



Route::post('/language/{code}', [LanguageController::class, 'switchLanguage'])->name('languages.switch');
Route::get('/get-languages', [LanguageController::class, 'getAll'])->name('languages.getAll');
Route::get('/get-translations/{code}', [TranslationController::class, 'getTranslations'])->name('translations.get');
Route::get('/page/{slug}', [PageController::class, 'show'])->name('page.show');

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/upload', [ProfileController::class, 'upload'])->name('profile.upload');
    Route::post('/profile/image/delete', [ProfileController::class, 'deleteImage'])->name('profile.image.delete');
    Route::post('/profile/update-image', [ProfileController::class, 'updateImage'])->name('profile.update-image');
    Route::post('/profile/delete-image', [ProfileController::class, 'deleteImage'])->name('profile.delete-image');
    Route::get('/chat', [MessageController::class, 'index'])->name('chat.index');
    Route::get('/chat/{user:id}', [MessageController::class, 'show'])->name('chat.show');
    // Route::get('/chat/{user:username}', [MessageController::class, 'show'])->name('chat.show');
    Route::get('/chat/place/{name}', [MessageController::class, 'placechat'])->name('placechat');
    Route::get('/chat/place/{name}/json', [MessageController::class, 'placechatJson']);
    Route::post('/chat/send', [MessageController::class, 'store'])->name('chat.store');
    Route::get('/chat/{user}/json', [MessageController::class, 'fetchJson']);
    Route::put('/chat/message/{message}', [MessageController::class, 'update'])->name('chat.update');
    Route::delete('/chat/message/{message}', [MessageController::class, 'destroy'])->name('chat.destroy');
    Route::post('/chat/seen/{user}', [MessageController::class, 'markSeen'])->name('chat.seen');
    Route::get('/posts/create', function () {return Inertia::render('Posts/Create');})->name('posts.create');
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::post('/posts/{post}/like', [LikeController::class, 'store']);
    Route::post('/posts/{id}/repost', [PostController::class, 'repost'])->name('posts.repost');
    Route::post('/comments/{comment}/like', [CommentLikeController::class, 'toggle']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('/follow/{user:username}', [FollowController::class, 'toggle'])->name('follow.toggle');
    Route::post('/ajax/follow/{user:username}', [FollowController::class, 'ajaxToggle'])->name('follow.ajax');
    Route::post('/ajax/remove-follower/{user:username}', [FollowController::class, 'removeFollower'])->name('follow.remove_follower');

    Route::post('/block/{user:username}', [BlockController::class, 'block'])->name('user.block');
    Route::delete('/block/{user:username}', [BlockController::class, 'unblock'])->name('user.unblock');

    Route::post('/follow/{user}/accept', [FollowController::class, 'acceptRequest'])->name('follow.accept');
    Route::post('/follow/{user}/reject', [FollowController::class, 'rejectRequest'])->name('follow.reject');
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/username-check', function (Request $request) {
        $request->validate([
            'username' => 'required|string|min:4|max:222',
        ]);
    
        $username = strtolower($request->username); // case-insensitive check
    
        $reserved = UsernameUnregister::where('username', $username)->exists();
    
        $exists = User::where('username', $username)
            ->where('id', '!=', auth()->id())
            ->exists();
    
        return response()->json(['available' => !$exists && !$reserved]);
    })->name('username.check');
    Route::post('/chat/message/{message}/react', [MessageReactionController::class, 'store']);
    Route::post('/settings/notifications', [ProfileController::class, 'updateNotifications'])->name('settings.notifications');
    Route::get('/users', [RootController::class, 'users'])->name('users.index');
    Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
    Route::get('/posts/{post}/comments', [PostController::class, 'loadComments']);
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
    Route::get('/{username}/posts', [ProfileController::class, 'loadPosts']);
    Route::get('/hashtag/{name}', [HashtagController::class, 'show'])->name('hashtag.show');
    Route::get('/statistics', [StatisticController::class, 'index'])->name('user.statistics');
    Route::post('/profile/privacy', function (\Illuminate\Http\Request $request) {
    $request->validate(['is_private' => 'boolean']);
    auth()->user()->update(['is_private' => $request->is_private]);
    return back();
    })->name('profile.privacy.update');
    Route::get('/{username}/followers', [ProfileController::class, 'followers'])->name('profile.followers');
    Route::get('/{username}/following', [ProfileController::class, 'following'])->name('profile.following');
    // Route::post('/remove-following/{user}', [FollowController::class, 'removeFollowing'])->name('follow.remove');

    // User pages
    Route::get('/pages', [UserPageController::class, 'index'])->name('user_pages.index');
    Route::get('/pages/create', [UserPageController::class, 'create'])->name('user_pages.create');
    Route::post('/pages', [UserPageController::class, 'store'])->name('user_pages.store');
    Route::get('/pages/category/{slug}', [UserPageController::class, 'category'])->name('user_pages.category');
    Route::get('/pages/{page:slug}', [UserPageController::class, 'show'])->name('user_pages.show');
    Route::get('/pages/{page:slug}/edit', [UserPageController::class, 'edit'])->name('user_pages.edit');
    Route::patch('/pages/{page:slug}', [UserPageController::class, 'update'])->name('user_pages.update');
    Route::post('/pages/{page:slug}/like', [UserPageController::class, 'like'])->name('user_pages.like');
    Route::post('/pages/{page:slug}/posts', [PostController::class, 'storeForPage'])->name('user_pages.posts.store');
    Route::post('/pages/{page:slug}/upload', [UserPageController::class, 'upload'])->name('user_pages.upload');
    Route::post('/pages/{page:slug}/image/delete', [UserPageController::class, 'deleteImage'])->name('user_pages.image.delete');



});
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);



Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/panel', [AdminBaseController::class, 'index'])->name('admin.index');

    Route::get('/users', [AdminBaseController::class, 'userList'])->name('admin.users.index');
    Route::delete('/users/{id}', [AdminBaseController::class, 'destroyUser'])->name('admin.users.destroy');
    Route::post('/users/{id}/make-admin', [AdminBaseController::class, 'makeAdmin'])->name('admin.users.makeAdmin');

    Route::get('/reports', [ReportAdminController::class, 'index'])->name('admin.reports.index');
    Route::delete('/reports/{report}/delete-post', [ReportAdminController::class, 'deletePost'])->name('admin.reports.delete-post');

    Route::get('/setting', [AdminBaseController::class, 'setting'])->name('admin.setting.index');
    Route::post('/upload-logo', [AdminBaseController::class, 'upload_logo'])->name('admin.upload-logo');
    Route::post('/settings/update-google', [AdminBaseController::class, 'updateGoogle'])->name('admin.settings.update-google');
    Route::post('/settings/update-app-name', [AdminBaseController::class, 'updateAppName']);
    Route::post('/settings/update-mail', [AdminBaseController::class, 'updateMailSettings']);
    Route::post('/settings/update-pwa', [AdminBaseController::class, 'updatePWA']);
    Route::post('/upload-pwa-icon', [AdminBaseController::class, 'uploadPwaIcon']);

    Route::get('/username-unregister', [AdminBaseController::class, 'usernameunregister'])->name('admin.usernameunregister.index');
    Route::post('/reserved-usernames', [AdminBaseController::class, 'usernameunregisterstore'])->name('reserved-usernames.store');

    Route::get('/languages', [LanguageController::class, 'index'])->name('languages.index');
    Route::post('/languages', [LanguageController::class, 'store'])->name('languages.store');
    Route::delete('/languages/{language}', [LanguageController::class, 'destroy'])->name('languages.destroy');

    Route::post('/update-translations/{code}', [TranslationController::class, 'updateTranslations'])->name('translations.update');

    Route::get('/pages', [AdminPageController::class, 'index'])->name('admin.pages.index');
    Route::get('/pages/create', [AdminPageController::class, 'create'])->name('admin.pages.create');
    Route::post('/pages', [AdminPageController::class, 'store'])->name('admin.pages.store');
    Route::get('/pages/{page:slug}/edit', [AdminPageController::class, 'edit'])->name('admin.pages.edit');
    Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('admin.pages.update');
    Route::delete('/pages/{page}', [AdminPageController::class, 'destroy'])->name('admin.pages.destroy');

    Route::post('/settings/update-maxupload', [AdminBaseController::class, 'updateMaxUpload']);

});


Route::get('/{username}', [ProfileController::class, 'show_profile'])->name('show_profile');