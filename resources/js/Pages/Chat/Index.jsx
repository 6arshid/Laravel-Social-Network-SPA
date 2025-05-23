import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ chats, search }) {
    const [query, setQuery] = useState(search || '');
    const [placeQuery, setPlaceQuery] = useState('');
    const [placeError, setPlaceError] = useState('');
    const { t } = useTranslation();

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {t('chat')}
                </h2>
            }
        >
            <Head title={t('chat')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="p-4 space-y-6 max-w-2xl mx-auto">
                                <h1 className="text-2xl font-bold text-center">{t('your_chats')}</h1>

                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('search_by_name_or_email')}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />

                                <form onSubmit={handlePlaceSearch} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={placeQuery}
                                        onChange={(e) => setPlaceQuery(e.target.value)}
                                        placeholder={t('search_place_placeholder')}
                                        className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {t('go')}
                                    </button>
                                </form>

                                {placeError && <p className="text-red-500">{placeError}</p>}

                                <div className="space-y-2 mt-4">
                                    {Object.entries(chats).length === 0 && (
                                        <p className="text-gray-500 text-center">{t('no_results_found')}</p>
                                    )}

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
                                                ? `📍 ${key.replace('place:', '')}`
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
                                                    className="block p-4 bg-white shadow-md rounded-xl hover:bg-gray-50 transition"
                                                >
                                                    <div className="font-semibold text-lg">{displayName}</div>
                                                    <div className="text-gray-600 text-sm truncate">
                                                        {firstMsg.content || t('sent_a_file_or_no_message')}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}