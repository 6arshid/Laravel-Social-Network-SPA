import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { users, following } = usePage().props;
  const { t } = useTranslation();
  const [followed, setFollowed] = useState(following || []);
  const [search, setSearch] = useState('');

  const toggleFollow = async (username, userId) => {
    try {
      const res = await fetch(route('follow.ajax', { user: username }), {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setFollowed((prev) =>
        data.status === 'followed'
          ? [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const goToChat = (id) => {
    router.visit(route('chat.show', { user: id }));
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');

      const query = {
        search,
        ...(page && { page })
      };

      router.get(route('users.index'), query, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      });
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {/* {t('users')} */}
        </h2>
      }
    >
      <Head title={t('users')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <div className="p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">{t('users')}</h1>

              {/* 🔍 Search Input */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search_by_name_or_username')}
                className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* ❌ No users */}
              {users.data.length === 0 && (
                <p className="text-gray-500">{t('no_users_found')}</p>
              )}

              {/* ✅ User List */}
              <ul className="space-y-4">
                {users.data.map(user => (
                  <li key={user.id} className="flex items-center justify-between border p-4 rounded">
                    <div className="flex items-center gap-4">
                      <Link href={`/${user.username}`}>
                        <img
                          src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition"
                        />
                      </Link>
                      <div>
                        <Link href={`/${user.username}`} className="font-bold text-blue-600 hover:underline">
                          @{user.username}
                        </Link>
                        <p>{user.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {following && (
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => toggleFollow(user.username, user.id)}
                        >
                          {followed.includes(user.id) ? t('unfollow') : t('follow')}
                        </button>
                      )}
                      <button
                        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                        onClick={() => goToChat(user.id)}
                      >
                        {t('message')}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 📄 Pagination */}
              <div className="mt-6 flex justify-center flex-wrap gap-2">
                {users.links.map((link, index) => (
                  <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => router.visit(link.url)}
                    className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
