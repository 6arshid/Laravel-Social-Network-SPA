<?php

namespace App\Http\Controllers;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;

class TranslationController extends Controller
{
    // واکشی ترجمه‌های یک زبان (API)
    public function getTranslations($code)
    {
        $language = Language::where('code', $code)->firstOrFail();

        $translations = $language->translations()
            ->pluck('value', 'key');

        return response()->json($translations);
    }

    public function updateTranslations(Request $request, $code)
    {
        try {
            $language = \App\Models\Language::where('code', $code)->firstOrFail();
            $data = $request->all();
    
            foreach ($data as $key => $value) {
                Translation::updateOrCreate(
                    [
                        'language_id' => $language->id,
                        'key' => $key,
                    ],
                    [
                        'value' => $value,
                    ]
                );
            }
    
            return response()->json([
                'success' => true,
                'message' => 'Translations updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Error updating translations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating translations.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}
