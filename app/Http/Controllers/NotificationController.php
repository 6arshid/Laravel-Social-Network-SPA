<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
public function getUserNotifications()
{
    $user = auth()->user();

    $notifications = \App\Models\Notification::where('user_id', $user->id)
        ->latest()
        ->take(10)
        ->get()
        ->map(function ($notif) {
            return [
                'id' => $notif->id,
                'message' => $notif->message,
                'link' => $notif->link,
                'read' => $notif->read,
                'type' => $notif->type ?? 'general',
                'data' => is_string($notif->data) ? json_decode($notif->data, true) : $notif->data, // 👈 این خط مهمه
                'created_at' => $notif->created_at->diffForHumans(),
            ];
        });

    $unreadCount = \App\Models\Notification::where('user_id', $user->id)
        ->where('read', false)
        ->count();

    return response()->json([
        'notifications' => $notifications,
        'unread_count' => $unreadCount,
    ]);
}




    public function markAsRead($id)
    {
        $user = auth()->user();
        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json(['success' => true]);
    }
public function markAllAsRead(Request $request)
{
    Notification::where('user_id', $request->user()->id)
                ->where('read', false)
                ->update(['read' => true]);

    return response()->json(['success' => true]);
}
}
