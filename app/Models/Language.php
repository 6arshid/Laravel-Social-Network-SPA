<?php
// app/Models/Language.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Language extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'code', 'direction'];

    // هر زبان دارای چندین ترجمه است
    public function translations()
    {
        return $this->hasMany(Translation::class);
    }
    
}
