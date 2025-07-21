import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { users, following } = usePage().props;
  const { t } = useTranslation();
  const [followed, setFollowed] = useState(following || []);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async (username, userId) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {t('users')}
          </h2>
        </div>
      }
    >
      <Head title={t('users')} />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('discover_users')}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('connect_with_amazing_people_in_our_community')}
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className={`max-w-2xl mx-auto transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className={`h-6 w-6 transition-colors duration-200 ${searchFocused ? 'text-purple-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('search_by_name_or_username')}
                className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {users.data.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_users_found')}</h3>
            <p className="text-gray-500 mb-6">{t('try_adjusting_your_search_criteria')}</p>
          </div>
        ) : (
          // Users Grid
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.data.map((user, index) => (
              <div 
                key={user.id} 
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* User Card Header */}
                <div className="relative p-6 pb-4">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Avatar */}
                  <Link href={`/${user.username}`} className="block mb-4">
                    <div className="relative w-20 h-20 mx-auto">
                      <img
                        src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                  
                  {/* User Info */}
                  <div className="text-center">
                    <Link 
                      href={`/${user.username}`} 
                      className="block group-hover:text-purple-600 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-200">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors duration-200">
                        @{user.username}
                      </p>
                    </Link>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {following && (
                  <div className="px-6 pb-6">
                    <div className="flex space-x-3">
                      {/* Follow Button */}
                      <button
                        onClick={() => toggleFollow(user.username, user.id)}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                          followed.includes(user.id)
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                        }`}
                      >
                        {loading ? (
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : followed.includes(user.id) ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-sm">{t('unfollow')}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sm">{t('follow')}</span>
                          </>
                        )}
                      </button>
                      
                      {/* Message Button */}
                      <button
                        onClick={() => goToChat(user.id)}
                        className="flex items-center justify-center p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Gradient Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {users.links && users.links.length > 3 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2 bg-white rounded-2xl border border-gray-200 p-2 shadow-sm">
              {users.links.map((link, index) => {
                const isActive = link.active;
                const isDisabled = !link.url;
                const isNavigation = link.label.includes('Previous') || link.label.includes('Next');
                
                if (isNavigation) {
                  return (
                    <button
                      key={index}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && router.visit(link.url)}
                      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                        isDisabled 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600 hover:scale-105'
                      }`}
                    >
                      {link.label.includes('Previous') ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                }
                
                return (
                  <button
                    key={index}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && router.visit(link.url)}
                    className={`flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-xl font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                        : isDisabled
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600 hover:scale-105'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}