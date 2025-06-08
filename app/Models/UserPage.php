<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPage extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'slug', 'category', 'bio'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(PageLike::class);
    }
}
