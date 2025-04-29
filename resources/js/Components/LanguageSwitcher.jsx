import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/get-languages') // حواست باشه مسیر admin رو درست بزنی
            .then(response => {
                setLanguages(response.data);
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
            });
    }, []);

    const changeLanguage = async (lngCode) => {
        try {
            const response = await axios.get(`/get-translations/${lngCode}`);
            const translations = response.data;
    
            // اضافه کردن ترجمه ها به i18next
            i18n.addResourceBundle(lngCode, 'translation', translations, true, true);
    
            // حالا زبان رو تغییر بده
            await i18n.changeLanguage(lngCode);
    
            setOpen(false);
        } catch (error) {
            console.error('Error changing language:', error);
        }
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
                <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {loading ? (
                            <div className="text-center p-2 text-sm">Loading translations...</div>
                        ) : (
                            languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    {lang.code === 'en' && '🇬🇧 '}
                                    {lang.code === 'fa' && '🇮🇷 '}
                                    {lang.code === 'da' && '🇩🇰 '}
                                    {lang.code === 'tr' && '🇹🇷 '}
                                    {lang.name}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
