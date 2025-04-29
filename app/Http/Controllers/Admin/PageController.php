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
    // نمایش لیست صفحات
    public function index()
    {
        $pages = Page::orderBy('id', 'asc')->get();
        // ارسال داده‌ها به کامپوننت React "Admin/Pages/Index"
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

    // ذخیره صفحه جدید
    public function store(Request $request)
    {
        // اعتبارسنجی داده‌های ورودی
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'lang' => 'required|string|in:en,fa',
        ]);

        // ایجاد رکورد جدید در دیتابیس
        Page::create($data);

        // ریدایرکت به لیست صفحات با یک پیام موفقیت (فلش‌پیام)
        return redirect()->route('admin.pages.index')
                         ->with('success', 'صفحه جدید با موفقیت ایجاد شد.');
    }

    // نمایش فرم ویرایش صفحه (پیدا کردن بر اساس id به صورت خودکار با Route Model Binding)
    public function edit(Page $page)
    {
        $languages = Language::select('code', 'name')->get();

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'languages' => $languages
        ]);
    }

    // به‌روزرسانی صفحه موجود
    public function update(Request $request, Page $page)
    {
        // اعتبارسنجی ورودی‌ها (اجازه تکرار slug برای همین رکورد)
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'required|string',
            'lang' => 'required|string|in:en,fa',
        ]);

        // بروزرسانی و ذخیره تغییرات
        $page->update($data);

        // ریدایرکت به صفحه لیست با پیام موفقیت
        return redirect()->route('admin.pages.index')
                         ->with('success', 'صفحه موردنظر با موفقیت ویرایش شد.');
    }

    // حذف صفحه
    public function destroy(Page $page)
    {
        $page->delete();
        return redirect()->route('admin.pages.index')
                         ->with('success', 'صفحه موردنظر حذف شد.');
    }
}
