import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ followedPosts, explorerPosts, suggestedUsers = [] }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('followed');
  const [suggestions, setSuggestions] = useState(suggestedUsers);

  const [followedData, setFollowedData] = useState(followedPosts);
  const [explorerData, setExplorerData] = useState(explorerPosts);

  const observer = useRef();
  const loaderRef = useRef(null);

  const activeData = activeTab === 'followed' ? followedData : explorerData;
  const setActiveData = activeTab === 'followed' ? setFollowedData : setExplorerData;

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

  const fetchMorePosts = async () => {
    if (!activeData?.links?.next) return;
    try {
      const response = await axios.get(activeData.links.next);
      const newPosts = response.data;

      setActiveData((prev) => ({
        ...newPosts,
        data: [...prev.data, ...newPosts.data],
      }));
    } catch (err) {
      console.error("Failed to load more posts", err);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!loaderRef.current || !activeData?.links?.next) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    observer.current.observe(loaderRef.current);
  }, [activeData.links?.next, activeTab]);

  const renderPosts = (posts) => {
    if (posts.data.length === 0) {
      if (activeTab === 'explorer') {
        return (
          <div className="text-center text-gray-500 py-10">
            <p className="mb-4">{t('no_explorer_posts')}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {t('back_to_top')}
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {t('retry')}
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-center text-gray-500 py-10">
            <p>{t('no_followed_posts')}</p>
          </div>
        );
      }
    }

    return posts.data.map((post) => (
      <div key={post.id} className="mb-8">
        <PostCard post={post} />
      </div>
    ));
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{t('dashboard')}</h2>}
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

            {/* 📌 Tabs */}
            <div className="mb-6 flex gap-4 border-b">
              <button
                onClick={() => setActiveTab('followed')}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === 'followed'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600'
                }`}
              >
                {t('followed_users')}
              </button>
              <button
                onClick={() => setActiveTab('explorer')}
                className={`px-4 py-2 border-b-2 transition ${
                  activeTab === 'explorer'
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600'
                }`}
              >
                {t('explorer')}
              </button>
            </div>

            {/* 📢 Posts */}
            {renderPosts(activeData)}

            {/* 🔁 Infinite Scroll Loader */}
            <div ref={loaderRef} className="h-10 mt-6 text-center text-gray-500">
              {activeData?.links?.next && <span>{t('loading')}...</span>}
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
