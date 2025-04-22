<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'post_url' => 'required|string',
            'reason' => 'required|string|min:5',
        ]);

        Report::create([
            'post_id' => $request->post_id,
            'post_url' => $request->post_url,
            'reason' => $request->reason,
        ]);

        return back()->with('success', 'Your report has been submitted successfully.');
    }
}
