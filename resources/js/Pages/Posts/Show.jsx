import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import CommentBox from '@/Components/CommentBox';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';

export default function Show({ post, comments, similarPosts }) {
  const auth = usePage().props.auth;
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <AuthenticatedLayout>
        <Head title="Post Details" />

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          {/* Header with Dark Mode Toggle */}
          <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Post Details
                </h1>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                >
                  {isDarkMode ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Main Post Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    {/* Post Header */}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {post.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.user?.name || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Post Title */}
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {post.title}
                      </h1>
                      
                      {/* Post Content */}
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {post.content}
                        </p>
                      </div>
                      
                      {/* Post Meta */}
                      <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-sm">{post.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm">{comments?.length || 0} comments</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">{post.likes || 0} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Comments ({comments?.length || 0})
                      </h2>
                    </div>
                    <CommentBox post={post} comments={comments} />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Author Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                      {post.user?.name?.charAt(0) || 'U'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.user?.name || 'Anonymous'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      {post.user?.bio || 'No bio available'}
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {post.user?.posts_count || 0}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {post.user?.followers_count || 0}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">Followers</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Post Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Views</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {post.views || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Comments</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comments?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Likes</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {post.likes || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Published</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Related Posts */}
                {similarPosts && similarPosts.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14-4l-4 4 4 4m-10-4h-.01" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Related Posts
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {similarPosts.slice(0, 3).map((relatedPost) => (
                        <div 
                          key={relatedPost.id}
                          className="group p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{relatedPost.user?.name}</span>
                            <span>•</span>
                            <span>{new Date(relatedPost.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </div>
  );
}