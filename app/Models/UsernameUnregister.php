<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsernameUnregister extends Model
{
    protected $table = 'username_unregister';

    protected $fillable = ['username'];
}
