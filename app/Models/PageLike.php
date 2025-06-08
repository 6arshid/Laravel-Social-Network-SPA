<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PageLike extends Model
{
    use HasFactory;

    protected $fillable = ['user_page_id', 'user_id'];

    public function page()
    {
        return $this->belongsTo(UserPage::class, 'user_page_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
