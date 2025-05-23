<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class LanguageController extends Controller
{
    // صفحه لیست زبان‌ها
    public function index()
    {
        $languages = Language::all();
        return Inertia::render('Admin/Languages/Index', [
            'languages' => $languages,
        ]);
    }

    // افزودن زبان جدید
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:50',
            'code' => 'required|string|max:5|unique:languages,code',
            'direction' => 'required|in:LTR,RTL',
        ]);

        $language = Language::create($data);

        // ساخت ترجمه‌های خالی برای زبان جدید
        $defaultLanguage = Language::where('code', 'en')->first();
        if ($defaultLanguage) {
            $keys = Translation::where('language_id', $defaultLanguage->id)->pluck('key');
            foreach ($keys as $key) {
                Translation::create([
                    'language_id' => $language->id,
                    'key' => $key,
                    'value' => '',
                ]);
            }
        }

        return response()->json($language);
    }

    // حذف زبان
    public function destroy(Language $language)
    {
        // قبل از حذف، ترجمه‌های مربوط به زبان رو حذف کن
        $language->translations()->delete();
        $language->delete();

        return response()->json(['success' => true]);
    }

    // سوییچ زبان کاربر
    public function switchLanguage($code)
    {
        $language = Language::where('code', $code)->first();
        if ($language) {
            App::setLocale($code);
            Session::put('locale', $code);
        }
        return back();
    }

    // گرفتن لیست زبان‌ها (API)
    public function getAll()
    {
        return response()->json(Language::select('id', 'name', 'code', 'direction')->get());
    }
}
