<?php

namespace App\Helpers;

use App\Models\Statistic;
use Illuminate\Support\Facades\Request;

class StatisticHelper
{
    public static function record($event = null)
    {
        Statistic::create([
            'url' => Request::path(),
            'event' => $event,
            'date' => now(),
        ]);
    }
}
