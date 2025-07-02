import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        axios.get('/get-languages')
            .then(response => {
                setLanguages(response.data);
                // Set current language based on i18n current language
                const current = response.data.find(lang => lang.code === i18n.language);
                setCurrentLanguage(current || response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
            });
    }, [i18n.language]);

    const changeLanguage = async (language) => {
        if (loading || language.code === i18n.language) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`/get-translations/${language.code}`);
            const translations = response.data;
    
            // Add translations to i18next
            i18n.addResourceBundle(language.code, 'translation', translations, true, true);
    
            // Change language
            await i18n.changeLanguage(language.code);
            
            setCurrentLanguage(language);
            setOpen(false);
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLanguageFlag = (code) => {
        const flags = {
            'en': '🇬🇧',
            'fa': '🇮🇷', 
            'da': '🇩🇰',
            'tr': '🇹🇷',
            'de': '🇩🇪',
            'fr': '🇫🇷',
            'es': '🇪🇸',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ru': '🇷🇺',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'zh': '🇨🇳',
            'ar': '🇸🇦',
        };
        return flags[code] || '🌐';
    };

    // Custom SVG Icons
    const ChevronDownIcon = () => (
        <svg 
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    const GlobeIcon = () => (
        <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
            />
        </svg>
    );

    const CheckIcon = () => (
        <svg 
            className="w-4 h-4 text-emerald-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const LoadingSpinner = () => (
        <svg 
            className="w-4 h-4 animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
        >
            <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
            />
            <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                disabled={loading}
                className={`
                    group relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                    rounded-xl border transition-all duration-200 min-w-[120px] justify-between
                    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    
                    /* Light mode */
                    bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900
                    hover:border-gray-300 hover:shadow-sm
                    
                    /* Dark mode */
                    dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 
                    dark:text-gray-200 dark:hover:text-white dark:hover:border-gray-500
                    
                    /* Focus states */
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800
                    
                    /* Active states */
                    ${open ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-blue-400 dark:ring-offset-gray-800' : ''}
                `}
                onClick={() => !loading && setOpen(!open)}
                aria-label="Select Language"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <div className="flex items-center gap-2">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {currentLanguage ? (
                                <>
                                    <span className="text-base leading-none">
                                        {getLanguageFlag(currentLanguage.code)}
                                    </span>
                                    <span className="hidden sm:inline-block font-medium">
                                        {currentLanguage.name}
                                    </span>
                                    <span className="sm:hidden font-medium">
                                        {currentLanguage.code.toUpperCase()}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <GlobeIcon />
                                    <span className="hidden sm:inline-block">Language</span>
                                    <span className="sm:hidden">Lang</span>
                                </>
                            )}
                        </>
                    )}
                </div>
                {!loading && <ChevronDownIcon />}
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className={`
                    absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl shadow-lg ring-1 ring-black ring-opacity-5
                    bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                    z-50 overflow-hidden
                    animate-in fade-in-0 zoom-in-95 duration-100
                `}>
                    <div className="p-1" role="listbox">
                        {/* Header */}
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <GlobeIcon />
                                Select Language
                            </div>
                        </div>

                        {/* Language Options */}
                        <div className="py-1 max-h-60 overflow-y-auto">
                            {languages.length === 0 ? (
                                <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    <GlobeIcon />
                                    <div className="mt-1">Loading languages...</div>
                                </div>
                            ) : (
                                languages.map((language) => {
                                    const isActive = currentLanguage?.code === language.code;
                                    const isLoading = loading && isActive;
                                    
                                    return (
                                        <button
                                            key={language.code}
                                            onClick={() => changeLanguage(language)}
                                            disabled={loading}
                                            className={`
                                                w-full flex items-center justify-between px-3 py-2.5 text-sm
                                                transition-colors duration-150 group
                                                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
                                                ${isActive 
                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                                                }
                                            `}
                                            role="option"
                                            aria-selected={isActive}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg leading-none">
                                                    {getLanguageFlag(language.code)}
                                                </span>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-medium">
                                                        {language.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                                        {language.code}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center">
                                                {isLoading ? (
                                                    <LoadingSpinner />
                                                ) : isActive ? (
                                                    <CheckIcon />
                                                ) : null}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}