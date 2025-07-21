import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ followedPosts, explorerPosts, suggestedUsers = [] }) {
  const { t } = useTranslation();
  const { captcha } = usePage().props;

  const [activeTab, setActiveTab] = useState('followed');
  const [suggestions, setSuggestions] = useState(suggestedUsers);
  const [darkMode, setDarkMode] = useState(false);

  const [followedData, setFollowedData] = useState(followedPosts ?? { data: [] });
  const [explorerData, setExplorerData] = useState(explorerPosts ?? { data: [] });

  const observer = useRef();
  const loaderRef = useRef(null);

  const activeData = activeTab === 'followed' ? followedData : explorerData;
  const setActiveData = activeTab === 'followed' ? setFollowedData : setExplorerData;

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
    if (!posts?.data?.length) {
      if (activeTab === 'explorer') {
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('no_explorer_posts')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">Discover amazing content from the community</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                {t('back_to_top')}
              </button>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('retry')}
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('no_followed_posts')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">Start following users to see their posts here</p>
          </div>
        );
      }
    }

    return posts.data.map((post, index) => (
      <div key={post.id} className={`transform transition-all duration-300 ${index % 2 === 0 ? 'animate-fade-in-left' : 'animate-fade-in-right'}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 mb-6 overflow-hidden">
          <PostCard post={post} captcha={captcha} />
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AuthenticatedLayout
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('dashboard')}
            </h2>

          </div>
        }
      >
        <Head title={t('dashboard')} />

        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">

            {/* Suggested Users Section */}
            {suggestions.length > 0 && (
              <div className="mb-12 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('suggested_users_to_follow')}</h2>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestions.map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`group relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`/${user.username}`} className="relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-700 group-hover:ring-blue-500 transition-all duration-300">
                              <img
                                src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                alt={user.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          </Link>
                          
                          <div className="flex-1 min-w-0">
                            <Link href={`/${user.username}`}>
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                                {user.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleFollow(user.username, user.id)}
                          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                          {t('follow')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('followed')}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                      activeTab === 'followed'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {t('followed_users')}
                  </button>
                  <button
                    onClick={() => setActiveTab('explorer')}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                      activeTab === 'explorer'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    {t('explorer')}
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-6">
              {renderPosts(activeData)}
            </div>

            {/* Loading Indicator */}
            {activeData?.links?.next && (
              <div ref={loaderRef} className="flex justify-center py-8">
                <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="font-medium">{t('loading')}...</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </AuthenticatedLayout>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}