<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Post;
use Illuminate\Support\Facades\File;

class ReportAdminController extends Controller
{
    public function index()
    {
        $reports = Report::with('post.user')->latest()->paginate(10);
        return inertia('Admin/Reports/Index', [
            'reports' => $reports
        ]);
    }

    public function deletePost(Report $report)
    {
        $post = $report->post;

        if (!$post) {
            return back()->with('error', 'Post not found.');
        }

        // Delete attached media files
        foreach ($post->media as $media) {
            $path = storage_path('app/public/' . $media->file_path);
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        // Mark post as deleted due to report
        $post->update([
            'content' => 'This post has been removed due to a violation report.',
        ]);

        // Optionally: delete media DB records
        $post->media()->delete();

        return back()->with('success', 'Post deleted due to report.');
    }
}
