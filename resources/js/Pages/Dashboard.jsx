import React, { useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PostCard from '@/Components/PostCard';
import CommentBox from '@/Components/CommentBox';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ posts, suggestedUsers = [] }) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState(suggestedUsers);

  const handleFollow = async (username, id) => {
    try {
      const { data } = await axios.post(`/ajax/follow/${username}`);

      if (data.status === 'followed') {
        setSuggestions((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error('Follow error:', error.response?.data || error.message);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {/* {t('dashboard')} */}
        </h2>
      }
    >
      <Head title={t('dashboard')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg p-6">

            {/* 🔍 Suggested Users */}
            {suggestions.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 {t('suggested_users_to_follow')}</h2>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((user) => (
                    <li key={user.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow">
                      <Link href={`/${user.username}`}>
                        <img
                          src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover hover:opacity-80 transition"
                        />
                      </Link>
                      <div className="flex-grow">
                        <Link href={`/${user.username}`}>
                          <div className="font-medium text-gray-900 hover:underline">{user.name}</div>
                        </Link>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                      <button
                        onClick={() => handleFollow(user.username, user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {t('follow')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 📢 Feed Header */}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">📢 {t('posts_from_followed_users')}</h1>

            {/* Posts */}
            {posts.data.length === 0 ? (
              <p className="text-gray-600">{t('no_posts_to_display')}</p>
            ) : (
              posts.data.map((post) => (
                <div key={post.id} className="mb-8">
                  <PostCard post={post} />
                  <CommentBox post={post} comments={post.comments?.data || []} />
                </div>
              ))
            )}

            {/* Pagination */}
            {posts.links?.next && (
              <div className="text-center mt-6">
                <Link
                  href={posts.links.next}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  preserveScroll
                >
                  {t('load_more')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
