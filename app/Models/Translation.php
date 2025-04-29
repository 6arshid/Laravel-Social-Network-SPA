<?php
// app/Models/Translation.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Translation extends Model
{
    use HasFactory;
    
    protected $fillable = ['language_id', 'key', 'value'];

    // هر ترجمه به یک زبان تعلق دارد
    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
