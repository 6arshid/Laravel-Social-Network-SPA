<?php

// app/Http/Controllers/Admin/PageController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Language;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    // Display the list of pages
    public function index()
    {
        $pages = Page::orderBy('id', 'asc')->get();
        // Pass data to the React component "Admin/Pages/Index"
        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages
        ]);
    }

    public function create()
    {
        $languages = Language::select('code', 'name')->get();
    
        return Inertia::render('Admin/Pages/Create', [
            'languages' => $languages
        ]);
    }

    // Store a new page
    public function store(Request $request)
    {
        // Validate the incoming request data
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'lang' => 'required|string|in:en,fa',
        ]);

        // Create a new record in the database
        Page::create($data);

        // Redirect to the page list with a success flash message
        return redirect()->route('admin.pages.index')
                         ->with('success', 'New page created successfully.');
    }

    // Show the edit page form
    public function edit(Page $page)
    {
        $languages = Language::select('code', 'name')->get();

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'languages' => $languages
        ]);
    }

    // Update an existing page
    public function update(Request $request, Page $page)
    {
        // Validate the inputs (allowing the current record to keep its slug)
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'required|string',
            'lang' => 'required|string|in:en,fa',
        ]);

        // Update and save changes
        $page->update($data);

        // Redirect to the page list with a success message
        return redirect()->route('admin.pages.index')
                         ->with('success', 'Page updated successfully.');
    }

    // Delete a page
    public function destroy(Page $page)
    {
        $page->delete();
        return redirect()->route('admin.pages.index')
                         ->with('success', 'Page deleted successfully.');
    }
}
