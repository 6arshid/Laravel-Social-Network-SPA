<?php
namespace App\Helpers;

use App\Models\User;
use App\Models\Notification;

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
    }
}
