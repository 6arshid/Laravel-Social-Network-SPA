import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MediaModal from '@/Components/MediaModal';
import RepostButton from '@/Components/RepostButton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import parseHashtags from '@/Utils/parseHashtags';
import Reactions from '@/Components/Reactions';

dayjs.extend(relativeTime);

export default function PostCard({ post }) {
  const { t } = useTranslation();
  const { auth, captcha } = usePage().props;

  const [modalIndex, setModalIndex] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', captcha: '' });
  const [captchaAnswer] = useState(captcha?.answer ?? null);

  const media = post.media || [];
  const isOwner = auth.user && auth.user.id === post.user_id;
  const isDeletedByReport = post.content === t('This post has been removed due to reporting abuse.');

  const handleDelete = () => {
    if (confirm(t('Are you sure you want to delete this post?'))) {
      router.delete(`/posts/${post.id}`);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!captchaAnswer || parseFloat(reportForm.captcha) !== parseFloat(captchaAnswer)) {
      alert(t('Incorrect captcha!'));
      return;
    }
    router.post('/reports', {
      post_id: post.id,
      post_url: window.location.href,
      reason: reportForm.reason,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setReportForm({ reason: '', captcha: '' });
        setReportModalOpen(false);
      },
    });
  };

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 group">
      {isDeletedByReport ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.12 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
            {t('This post has been removed due to a violation report.')}
          </p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {post.page ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <Link
                        href={route('user_pages.show', post.page.slug)}
                        className="text-gray-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      >
                        {post.page.name}
                      </Link>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Verified Page</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  post.user && (
                    <div className="flex items-center space-x-3">
                      <Link href={route('show_profile', post.user.username)} className="relative group">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all duration-300">
                          <img
                            src={post.user.avatar ? `/storage/${post.user.avatar}` : '/default-avatar.png'}
                            alt={post.user.username}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      </Link>
                      <div>
                        <Link
                          href={route('show_profile', post.user.username)}
                          className="text-gray-900 dark:text-white font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          @{post.user.username}
                        </Link>
                        {typeof post.views === 'number' && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{post.views.toLocaleString()} views</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href={route('posts.show', post.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{dayjs(post.created_at).fromNow()}</span>
                </Link>
                
                {/* More options button */}
                <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            {post.repost ? (
              <div className="space-y-4">
                {post.content && (
                  <div className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
                    {parseHashtags(post.content)}
                  </div>
                )}
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Reposted from</span>
                    <Link 
                      href={route('posts.show', post.repost.id)} 
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      @{post.repost.user?.username || 'Deleted User'}
                    </Link>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {parseHashtags(post.repost.content)}
                  </div>
                  {post.repost.media?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                      {post.repost.media.map((m) => (
                        <div key={m.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-600">
                          {m.type === 'image' ? (
                            <img 
                              src={`/storage/${m.file_path}`} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                              alt="" 
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <video className="w-full h-full object-cover" muted>
                                <source src={`/storage/${m.file_path}`} type="video/mp4" />
                              </video>
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors duration-300">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed">
                {parseHashtags(post.content)}
              </div>
            )}
          </div>

          {/* Media Gallery */}
          {media.length > 0 && (
            <div className="px-6 pb-4">
              <div className={`grid gap-3 ${
                media.length === 1 ? 'grid-cols-1' :
                media.length === 2 ? 'grid-cols-2' :
                media.length === 3 ? 'grid-cols-3' :
                'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
              }`}>
                {media.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setModalIndex(i)}
                    className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                      media.length === 1 ? 'aspect-video' : 'aspect-square'
                    }`}
                  >
                    {m.type === 'image' ? (
                      <img 
                        src={`/storage/${m.file_path}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt="" 
                      />
                    ) : (
                      <>
                        <video className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" muted playsInline>
                          <source src={`/storage/${m.file_path}`} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-300">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Reactions postId={post.id} reactions={post.likes} currentUserId={auth.user?.id} />
                
                <button 
                  onClick={() => setReportModalOpen(true)} 
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.12 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm font-medium">Report</span>
                </button>

                <RepostButton postId={post.id} isOwner={isOwner} />
              </div>

              {isOwner && (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => router.get(`/posts/${post.id}/edit`)} 
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <MediaModal media={media} index={modalIndex} onClose={(i = null) => setModalIndex(i)} />
        </>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.12 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Post</h2>
                </div>
                <button 
                  onClick={() => setReportModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleReportSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Reason for report
                </label>
                <textarea
                  value={reportForm.reason}
                  onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                  placeholder="Please describe the issue clearly..."
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20 transition-all duration-200 resize-none"
                />
              </div>
              
              {captcha?.question && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Security verification: {captcha.question}
                  </label>
                  <input
                    type="number"
                    value={reportForm.captcha}
                    onChange={(e) => setReportForm({ ...reportForm, captcha: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 text-gray-900 dark:text-gray-100 focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-400/20 transition-all duration-200"
                    required
                  />
                </div>
              )}
              
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  Submit Report
                </button>
                <button 
                  type="button" 
                  onClick={() => setReportModalOpen(false)} 
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}