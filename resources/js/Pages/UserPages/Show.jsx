import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, Head, usePage } from '@inertiajs/react';
import PostForm from '@/Components/PostForm';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';
import UpdateAvatarCoverForm from './Partials/UpdateAvatarCoverForm';
import { useState } from 'react';

export default function Show({ page, isLiked, posts }) {
  const { t } = useTranslation();
  const auth = usePage().props.auth;
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(page.likes_count);
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    setLoading(true);
    try {
      router.post(route('user_pages.like', page.slug), {}, {
        onSuccess: () => {
          setLiked(!liked);
          setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        }
      });
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (posts.next_page_url) {
      router.visit(posts.next_page_url, { 
        preserveScroll: true, 
        only: ['posts'],
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false)
      });
    }
  };

  return (
    <AuthenticatedLayout 
      header={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {page.name}
            </h2>
          </div>
          
          <Link 
            href={route('user_pages.index')} 
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">{t('back_to_pages')}</span>
          </Link>
        </div>
      }
    >
      <Head title={page.name} />
      
      {/* Cover Image Section */}
      {page.cover && (
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <img 
            src={`/storage/${page.cover}`} 
            alt="cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Floating Avatar */}
          {page.avatar && (
            <div className="absolute bottom-6 left-6 sm:left-8">
              <div className="relative">
                <img 
                  src={`/storage/${page.avatar}`} 
                  alt="avatar" 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
              {/* Avatar Section (when no cover) */}
              {!page.cover && page.avatar && (
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="relative inline-block">
                    <img 
                      src={`/storage/${page.avatar}`} 
                      alt="avatar" 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
                  </div>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Page Title (when no cover) */}
                {!page.cover && (
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.name}</h1>
                  </div>
                )}

                {/* Category */}
                {page.category && (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 text-blue-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <Link 
                      href={route('user_pages.category', page.category.toLowerCase().replace(/\s+/g, '-'))} 
                      className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      {page.category}
                    </Link>
                  </div>
                )}

                {/* Bio */}
                {page.bio && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{t('about')}</h3>
                    <p className="text-gray-600 leading-relaxed">{page.bio}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {page.website && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9c-1.657 0-3 .895-3 2v5c0 1.105 1.343 2 3 2m0-9c1.657 0 3 .895 3 2v5c0-1.105-1.343-2-3-2" />
                        </svg>
                      </div>
                      <a 
                        href={page.website} 
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {page.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  {page.phone_number && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{page.phone_number}</span>
                    </div>
                  )}

                  {page.public_email && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <a 
                        href={`mailto:${page.public_email}`}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                      >
                        {page.public_email}
                      </a>
                    </div>
                  )}

                  {page.location && (
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{page.location}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                  {/* Like Button */}
                  <button 
                    onClick={toggleLike} 
                    disabled={loading}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 ${
                      liked
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}
                  >
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : liked ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>{t('unlike')} ({likesCount})</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{t('like')} ({likesCount})</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button (Owner Only) */}
                  {auth.user && auth.user.id === page.user_id && (
                    <Link 
                      href={route('user_pages.edit', page.slug)} 
                      className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>{t('edit_page')}</span>
                    </Link>
                  )}
                </div>

                {/* Avatar/Cover Upload Form (Owner Only) */}
                {auth.user && auth.user.id === page.user_id && (
                  <div className="pt-4 border-t border-gray-100">
                    <UpdateAvatarCoverForm page={page} />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-6">
            {/* Post Form (Owner Only) */}
            {auth.user && auth.user.id === page.user_id && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('create_new_post')}</h3>
                </div>
                <PostForm action={route('user_pages.posts.store', page.slug)} />
              </div>
            )}

            {/* Posts Section */}
            <div className="space-y-6">
              {posts.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_posts_yet')}</h3>
                  <p className="text-gray-500">{t('this_page_hasnt_shared_anything_yet')}</p>
                </div>
              ) : (
                posts.data.map((post, index) => (
                  <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <PostCard post={post} />
                  </div>
                ))
              )}

              {/* Load More Button */}
              {posts.next_page_url && (
                <div className="text-center pt-6">
                  <button 
                    onClick={loadMorePosts} 
                    disabled={loading}
                    className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('loading')}...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        {t('load_more_posts')}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}