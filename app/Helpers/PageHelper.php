<?php
// app/Helpers/PageHelper.php

namespace App\Helpers;

use App\Models\Page;

class PageHelper
{
    /**
     * گرفتن لیست صفحات براساس زبان فعلی
     *
     * @return \Illuminate\Support\Collection
     */

    public static function getPagesByLocale()
    {
        return Page::where('lang', app()->getLocale())
                   ->orderBy('title')
                   ->get(['id', 'title', 'slug', 'lang']);
    }
}
