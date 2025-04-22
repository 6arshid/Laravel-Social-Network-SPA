<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MessagePolicy
{
    public function update(User $user, Message $message)
    {
        return $message->sender_id === $user->id;
    }
    
    public function delete(User $user, Message $message)
    {
        return $message->sender_id === $user->id;
    }
}
