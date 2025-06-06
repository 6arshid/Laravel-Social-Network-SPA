<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['user_id', 'message', 'link', 'read','data','type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    protected $casts = [
    'read' => 'boolean',
    'data' => 'array',
];
}

