import { useState } from 'react';
import AddLanguageForm from '@/Components/AddLanguageForm';
import LanguageList from '@/Components/LanguageList';
import axios from 'axios';

export default function LanguagesIndex({ languages: initialLanguages }) {
    const [languages, setLanguages] = useState(initialLanguages);
    const [selectedLang, setSelectedLang] = useState(null);
    const [translations, setTranslations] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    const handleLanguageAdded = (newLang) => {
        setLanguages([...languages, newLang]);
    };

    const handleLanguageDeleted = (lang) => {
        setLanguages(languages.filter(l => l.id !== lang.id));
        if (selectedLang && selectedLang.id === lang.id) {
            setSelectedLang(null);
            setTranslations({});
        }
    };

    const handleEditTranslations = async (lang) => {
        setSelectedLang(lang);
        setIsLoading(true);
        try {
            const res = await axios.get(`/get-translations/${lang.code}`);
            setTranslations(res.data);
        } catch (err) {
            console.error('Error fetching translations:', err);
            setSaveStatus('Error loading translations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslationChange = (key, value) => {
        setTranslations(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveTranslations = async () => {
        if (!selectedLang) return;
        setIsLoading(true);
        setSaveStatus('');
        try {
            const res = await axios.post(`/admin/update-translations/${selectedLang.code}`, translations);
            console.log('Save response:', res.data);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (err) {
            console.error('Error saving translations:', err.response?.data || err.message);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const closeTranslationEditor = () => {
        setSelectedLang(null);
        setTranslations({});
        setSaveStatus('');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Language Management
                        </h1>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage your application languages and translations
                        </p>
                    </div>
                    
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                            isDarkMode 
                                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Add Language Form */}
                    <div className="xl:col-span-1">
                        <div className={`rounded-xl shadow-sm border p-6 ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Add New Language
                            </h2>
                            <AddLanguageForm onLanguageAdded={handleLanguageAdded} isDarkMode={isDarkMode} />
                        </div>
                    </div>

                    {/* Right Column - Language List */}
                    <div className="xl:col-span-2">
                        <div className={`rounded-xl shadow-sm border ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Available Languages
                                    </h2>
                                    <div className={`text-sm px-3 py-1 rounded-full ${
                                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {languages.length} {languages.length === 1 ? 'Language' : 'Languages'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <LanguageList 
                                    languages={languages} 
                                    onDelete={handleLanguageDeleted} 
                                    onEditTranslations={handleEditTranslations}
                                    isDarkMode={isDarkMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Translation Editor Modal/Panel */}
                {selectedLang && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            {/* Modal Header */}
                            <div className={`px-6 py-4 border-b flex items-center justify-between ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div>
                                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Edit Translations
                                    </h3>
                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {selectedLang.name} ({selectedLang.code})
                                    </p>
                                </div>
                                <button
                                    onClick={closeTranslationEditor}
                                    className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                                        isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-4 max-h-96 overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Loading translations...
                                            </span>
                                        </div>
                                    </div>
                                ) : Object.keys(translations).length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            No translations found
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {Object.entries(translations).map(([key, value]) => (
                                            <div key={key} className="group">
                                                <label className={`block text-sm font-medium mb-2 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}>
                                                    {key}
                                                </label>
                                                <input 
                                                    type="text" 
                                                    value={value}
                                                    onChange={e => handleTranslationChange(key, e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        isDarkMode 
                                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                                    }`}
                                                    placeholder={`Enter translation for ${key}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className={`px-6 py-4 border-t flex items-center justify-between ${
                                isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <div className="flex items-center gap-2">
                                    {saveStatus === 'success' && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm font-medium">Saved successfully</span>
                                        </div>
                                    )}
                                    {saveStatus === 'error' && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-medium">Error saving translations</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={closeTranslationEditor}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveTranslations}
                                        disabled={isLoading || Object.keys(translations).length === 0}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        )}
                                        Save Translations
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}