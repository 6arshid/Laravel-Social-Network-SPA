import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Dashboard({ chats, search }) {
    const [query, setQuery] = useState(search || '');
    const [placeQuery, setPlaceQuery] = useState('');
    const [placeError, setPlaceError] = useState('');

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
                setPlaceError('❌ Place not found or no chat exists for it.');
            }
        } catch (err) {
            setPlaceError('⚠️ An error occurred. Try again.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="p-4 space-y-6 max-w-2xl mx-auto">
                                <h1 className="text-2xl font-bold text-center">💬 Your Chats</h1>

                                {/* Search user input */}
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />

                                {/* Search place form */}
                                <form onSubmit={handlePlaceSearch} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={placeQuery}
                                        onChange={(e) => setPlaceQuery(e.target.value)}
                                        placeholder="Search place..."
                                        className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Go
                                    </button>
                                </form>
                                {placeError && <p className="text-red-500">{placeError}</p>}

                                {/* Chat list */}
                                <div className="space-y-2 mt-4">
                                    {Object.entries(chats).length === 0 && (
                                        <p className="text-gray-500 text-center">No results found.</p>
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
                                                href = firstMsg.sender?.username ? `/chat/${firstMsg.sender.username}` : '#';
                                            } else if (firstMsg.receiver?.username) {
                                                href = `/chat/${firstMsg.receiver.username}`;
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
                                                        {firstMsg.content || '📎 Sent a file or no messages yet'}
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
