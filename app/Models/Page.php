<?php

// app/Models/Page.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    // مشخص کردن فیلدهایی که قابلیت پر شدن توسط Mass Assignment را دارند
    protected $fillable = ['title', 'slug', 'content', 'lang'];

    // (اختیاری) اگر بخواهیم Route Model Binding بر اساس slug باشد:
  public function getRouteKeyName() {
        return 'slug';
  }
}

