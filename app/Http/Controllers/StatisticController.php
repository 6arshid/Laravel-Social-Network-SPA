<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StatisticController extends Controller
{
    public function index()
    {
        $daily = Statistic::select(DB::raw('DATE(date) as day'), DB::raw('count(*) as total'))
        ->groupBy('day')
        ->orderBy('day')
        ->get();

    $monthly = Statistic::select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'), DB::raw('count(*) as total'))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    $yearly = Statistic::select(DB::raw('YEAR(date) as year'), DB::raw('count(*) as total'))
        ->groupBy('year')
        ->orderBy('year')
        ->get();

    $total = Statistic::count();

    return Inertia::render('Profile/Statistics', [

        'daily' => $daily,
        'monthly' => $monthly,
        'yearly' => $yearly,
        'total' => $total,
    ]);
    }
}
