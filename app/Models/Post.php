<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserPage;

class Post extends Model
{
    protected $fillable = ['user_id', 'content', 'repost_id', 'is_repost', 'user_page_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function page()
    {
        return $this->belongsTo(UserPage::class, 'user_page_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function likedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }
    public function repost()
    {
        return $this->belongsTo(Post::class, 'repost_id');
    }

    public function reposts()
    {
        return $this->hasMany(Post::class, 'repost_id');
    }

    
}