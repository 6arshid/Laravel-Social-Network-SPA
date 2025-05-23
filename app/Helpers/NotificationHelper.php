<?php
namespace App\Helpers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;

class NotificationHelper
{
public static function send($userId, $message, $link = null, $type = 'general', $data = [])
{
    Notification::create([
        'user_id' => $userId,
        'message' => $message,
        'link' => $link,
        'type' => $type,
        'data' => json_encode($data),
        'read' => false,
    ]);

    $user = User::find($userId);
    if ($user && !$user->disable_notifications && $user->email) {
        \Mail::raw($message . ($link ? "\n\nView: " . $link : ''), function ($mail) use ($user) {
            $mail->to($user->email)
                ->subject('You have a new notification');
        });
    }
}
public static function markAllAsReadForUser($user)
{
    $user->unreadNotifications->markAsRead();
}

}
