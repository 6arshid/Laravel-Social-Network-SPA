<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
class MessageReactionController extends Controller
{
    public function store(Request $request, Message $message)
    {
        $user = Auth::user();
        $emoji = $request->input('emoji');
    
        $existing = $message->reactions()->where('user_id', $user->id)->first();
    
        if ($existing && $existing->emoji === $emoji) {
            $existing->delete();
        } else {
            if ($existing) $existing->delete();
    
            $message->reactions()->create([
                'user_id' => $user->id,
                'emoji' => $emoji,
            ]);
        }
    
        return response()->json([
            'reactions' => $message->reactions()->get(),
        ]);
    }
}
