<?php
namespace App\Helpers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;

class NotificationHelper
{
    public static function send($userId, $message, $link = null)
    {
        Notification::create([
            'user_id' => $userId,
            'message' => $message,
            'link' => $link,
            'read' => false,
        ]);
         // Get the user
         $user = User::find($userId);

         if ($user && !$user->disable_notifications && $user->email) {
            Mail::raw($message . ($link ? "\n\nView: " . $link : ''), function ($mail) use ($user) {
                $mail->to($user->email)
                    ->subject('You have a new notification');
            });
        }
        
    }
}
