import { useState } from 'react';
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, router, Link } from '@inertiajs/react';

export default function UserList({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this user?")) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleMakeAdmin = (id) => {
        router.post(`/admin/users/${id}/make-admin`);
    };

    return (
        <AuthenticatedLayoutAdmin
            header={<h2 className="text-xl font-semibold text-gray-800">Users List</h2>}
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSearch} className="mb-4 flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email"
                                className="border px-4 py-2 rounded w-full"
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Search
                            </button>
                        </form>

                        <table className="min-w-full table-auto border border-gray-200 mb-6">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Admin</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{user.name}</td>
                                        <td className="border px-4 py-2">{user.email}</td>
                                        <td className="border px-4 py-2">{user.is_admin ? 'Yes' : 'No'}</td>
                                        <td className="border px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                            {!user.is_admin && (
                                                <button
                                                    onClick={() => handleMakeAdmin(user.id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-center space-x-2">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-1 rounded ${
                                        link.active
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
