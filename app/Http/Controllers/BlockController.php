<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlockController extends Controller
{
    public function block(User $user)
    {
        $auth = auth()->user();
        if ($auth->id === $user->id) {
            return response()->json(['error' => 'Cannot block yourself'], 422);
        }

        Block::firstOrCreate([
            'user_id' => $auth->id,
            'blocked_id' => $user->id,
        ]);

        return response()->json(['blocked' => true]);
    }

    public function unblock(User $user)
    {
        $auth = auth()->user();
        Block::where('user_id', $auth->id)->where('blocked_id', $user->id)->delete();
        return response()->json(['unblocked' => true]);
    }
}
