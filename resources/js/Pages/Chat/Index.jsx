import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function Dashboard({ chats, search }) {
    const [query, setQuery] = useState(search || '');

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
                            <div className="p-4 space-y-4 max-w-2xl mx-auto">
                                <h1 className="text-2xl font-bold text-center">💬 Your Chats</h1>

                                {/* Search input */}
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />

                                {/* Chat list */}
                                <div className="space-y-2 mt-4">
                                    {Object.entries(chats).length === 0 && (
                                        <p className="text-gray-500 text-center">No results found.</p>
                                    )}

                                    {Object.entries(chats)
                                        .sort((a, b) => {
                                            const aTime = new Date(a[1][0]?.created_at).getTime();
                                            const bTime = new Date(b[1][0]?.created_at).getTime();
                                            return bTime - aTime; // sort descending
                                        })
                                        .map(([userId, messages]) => {
                                            const firstMsg = messages[0];
                                            if (!firstMsg) return null;

                                            const user =
                                                firstMsg.sender?.id === parseInt(userId)
                                                    ? firstMsg.sender
                                                    : firstMsg.receiver;

                                            if (!user) return null;

                                            return (
                                                <Link
                                                    key={userId}
                                                    href={`/chat/${user.username}`}
                                                    className="block p-4 bg-white shadow-md rounded-xl hover:bg-gray-50 transition"
                                                >
                                                    <div className="font-semibold text-lg">{user.name}</div>
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
