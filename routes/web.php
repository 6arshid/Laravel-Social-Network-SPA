<?php

use App\Http\Controllers\Admin\ReportAdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentLikeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HashtagController;
use App\Http\Controllers\MessageReactionController;
use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::get('/chat/{user:username}', [MessageController::class, 'show'])->name('chat.show');
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
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::post('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);
    Route::post('/username-check', function (Request $request) {
        $request->validate([
            'username' => 'required|string|min:4|max:222',
        ]);
    
        $exists = User::where('username', $request->username)
            ->where('id', '!=', auth()->id())
            ->exists();
    
        return response()->json(['available' => !$exists]);
    })->name('username.check');
    Route::post('/chat/message/{message}/react', [MessageReactionController::class, 'store']);
});
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);

Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts/{post}/comments', [PostController::class, 'loadComments']);
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::get('/{username}/posts', [ProfileController::class, 'loadPosts']);
Route::get('/hashtag/{name}', [HashtagController::class, 'show'])->name('hashtag.show');
Route::get('/{username}', [ProfileController::class, 'show_profile'])->name('show_profile');

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/reports', [ReportAdminController::class, 'index'])->name('admin.reports.index');
    Route::delete('/reports/{report}/delete-post', [ReportAdminController::class, 'deletePost'])->name('admin.reports.delete-post');
});