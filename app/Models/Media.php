<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = ['post_id', 'file_path', 'type'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
