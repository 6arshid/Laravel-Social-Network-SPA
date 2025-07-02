import axios from 'axios';
import { useState } from 'react';

export default function LanguageList({ languages, onDelete, onEditTranslations }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (lang) => {
        if (!confirm(`Are you sure you want to delete "${lang.name}"?`)) return;
        
        setIsDeleting(lang.id);
        try {
            await axios.delete(`/admin/languages/${lang.id}`);
            onDelete(lang);
            alert('Language deleted successfully.');
        } catch (err) {
            console.error('Error deleting language:', err);
            alert('Error deleting language.');
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const DeleteIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const EditIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );

    const SearchIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const LanguageIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
    );

    const LoadingSpinner = () => (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <LanguageIcon />
            <p className="mt-4 text-lg font-medium">No languages found</p>
            <p className="mt-2 text-sm">Try adjusting your search criteria</p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <LanguageIcon />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Languages Management</h3>
                            <p className="text-blue-100 text-sm">Manage your application languages</p>
                        </div>
                    </div>
                    <div className="text-sm text-blue-100 bg-white/10 px-3 py-1 rounded-full">
                        {filteredLanguages.length} {filteredLanguages.length === 1 ? 'Language' : 'Languages'}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search languages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {filteredLanguages.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead className="bg-gray-100 dark:bg-gray-600">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Language
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Direction
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                                        {filteredLanguages.map((lang, index) => (
                                            <tr key={lang.id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                                                            {lang.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {lang.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {lang.code}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        lang.direction === 'rtl' 
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }`}>
                                                        {lang.direction.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => onEditTranslations(lang)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                        >
                                                            <EditIcon />
                                                            <span className="ml-1">Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(lang)}
                                                            disabled={isDeleting === lang.id}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isDeleting === lang.id ? <LoadingSpinner /> : <DeleteIcon />}
                                                            <span className="ml-1">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {filteredLanguages.map((lang, index) => (
                                <div key={lang.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                {lang.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {lang.name}
                                                </h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {lang.code}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        lang.direction === 'rtl' 
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }`}>
                                                        {lang.direction.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            #{index + 1}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                        <button
                                            onClick={() => onEditTranslations(lang)}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                            <EditIcon />
                                            <span className="ml-2">Edit Translations</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lang)}
                                            disabled={isDeleting === lang.id}
                                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isDeleting === lang.id ? <LoadingSpinner /> : <DeleteIcon />}
                                            <span className="ml-2">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}