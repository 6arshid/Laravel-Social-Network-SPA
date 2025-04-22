<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['post_id', 'post_url', 'reason'];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
