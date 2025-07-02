import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ chats, search }) {
    const [query, setQuery] = useState(search || '');
    const [placeQuery, setPlaceQuery] = useState('');
    const [placeError, setPlaceError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const { t } = useTranslation();

    // Dark mode toggle
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            const q = query.trim();
            router.visit(`/chat${q ? `?search=${encodeURIComponent(q)}` : ''}`, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [query]);

    const handlePlaceSearch = async (e) => {
        e.preventDefault();
        setPlaceError('');
        const name = placeQuery.trim();
        if (!name) return;

        try {
            const res = await fetch(`/chat/place/${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                router.visit(`/chat/place/${encodeURIComponent(name)}`);
            } else {
                setPlaceError(t('place_not_found'));
            }
        } catch (err) {
            setPlaceError(t('error_occurred'));
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInHours < 1) {
            return `${Math.floor(diffInMs / (1000 * 60))}m ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else if (diffInDays < 7) {
            return `${Math.floor(diffInDays)}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
            <AuthenticatedLayout
                header={
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('chat')}
                        </h2>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                    </div>
                }
            >
                <Head title={t('chat')} />

                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                                    {t('your_chats')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Stay connected with your conversations
                                </p>
                            </div>

                            {/* Search Section */}
                            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
                                <div className="space-y-6">
                                    {/* Regular Chat Search */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder={t('search_by_name_or_email')}
                                            className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400">
                                                or search by location
                                            </span>
                                        </div>
                                    </div>

                                    {/* Place Search */}
                                    <form onSubmit={handlePlaceSearch} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={placeQuery}
                                                onChange={(e) => setPlaceQuery(e.target.value)}
                                                placeholder={t('search_place_placeholder')}
                                                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-700/80 border border-blue-200 dark:border-blue-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-blue-500/20 outline-none"
                                        >
                                            {t('go')}
                                        </button>
                                    </form>

                                    {placeError && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                            <p className="text-red-600 dark:text-red-400 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {placeError}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chat List */}
                            <div className="space-y-4">
                                {Object.entries(chats).length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                            <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No conversations yet</h3>
                                        <p className="text-gray-500 dark:text-gray-400">{t('no_results_found')}</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 sm:gap-6">
                                        {Object.entries(chats)
                                            .sort((a, b) => {
                                                const aTime = new Date(a[1][0]?.created_at).getTime();
                                                const bTime = new Date(b[1][0]?.created_at).getTime();
                                                return bTime - aTime;
                                            })
                                            .map(([key, messages]) => {
                                                const firstMsg = messages[0];
                                                if (!firstMsg) return null;

                                                const isPlace = key.startsWith('place:');
                                                const displayName = isPlace
                                                    ? key.replace('place:', '')
                                                    : (
                                                        firstMsg.sender?.id === parseInt(key)
                                                            ? firstMsg.sender?.name
                                                            : firstMsg.receiver?.name
                                                    );

                                                let href = '#';
                                                if (isPlace) {
                                                    href = `/chat/place/${key.replace('place:', '')}`;
                                                } else if (firstMsg.sender?.id === parseInt(key)) {
                                                    href = firstMsg.sender?.id ? `/chat/${firstMsg.sender.id}` : '#';
                                                } else if (firstMsg.receiver?.id) {
                                                    href = `/chat/${firstMsg.receiver.id}`;
                                                }

                                                if (!displayName || href === '#') return null;

                                                return (
                                                    <Link
                                                        key={key}
                                                        href={href}
                                                        className="group block"
                                                    >
                                                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-gray-800/90">
                                                            <div className="flex items-center space-x-4">
                                                                {/* Avatar */}
                                                                <div className="flex-shrink-0">
                                                                    {isPlace ? (
                                                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                                            <span className="text-white font-semibold text-lg">
                                                                                {displayName?.charAt(0)?.toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Content */}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                            {displayName}
                                                                        </h3>
                                                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                                                            {formatTime(firstMsg.created_at)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
                                                                        {firstMsg.content || t('sent_a_file_or_no_message')}
                                                                    </p>
                                                                </div>

                                                                {/* Arrow */}
                                                                <div className="flex-shrink-0">
                                                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}