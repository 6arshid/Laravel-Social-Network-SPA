import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    const languages = [
        { code: 'en', label: '🇬🇧 English' },
        { code: 'fa', label: '🇮🇷 فارسی' },
        { code: 'da', label: '🇩🇰 Dansk' },
        { code: 'tr', label: '🇹🇷 Türkçe' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // تغییر زبان سمت React
        router.post(`/language/${lng}`, {}, { preserveScroll: true }); // اطلاع به Laravel
        setOpen(false); // بستن Dropdown بعد از انتخاب
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium hover:bg-gray-100"
                onClick={() => setOpen(!open)}
            >
                🌐 Language
            </button>

            {open && (
                <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
