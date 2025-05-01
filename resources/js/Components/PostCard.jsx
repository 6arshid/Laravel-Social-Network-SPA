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
  const auth = usePage().props.auth;
  const [modalIndex, setModalIndex] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', captcha: '' });
  const [captchaAnswer] = useState(7);

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
    if (parseInt(reportForm.captcha) !== captchaAnswer) {
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
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 space-y-5 mt-6">
      {isDeletedByReport ? (
        <p className="text-red-600 text-center text-lg font-semibold">
          {t('This post has been removed due to a violation report.')}
        </p>
      ) : (
        <>
          {/* User Info with Avatar and Timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.user && (
                <>
                  <Link href={route('show_profile', post.user.username)}>
                    <img
                      src={post.user.avatar ? `/storage/${post.user.avatar}` : '/default-avatar.png'}
                      alt={post.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      href={route('show_profile', post.user.username)}
                      className="text-neutral-800 font-semibold hover:underline text-sm"
                    >
                      @{post.user.username}
                    </Link>
                    {typeof post.views === 'number' && (
                      <span className="text-neutral-500 text-xs">{post.views} {t('views')}</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <Link
              href={route('posts.show', post.id)}
              className="text-neutral-500 text-xs hover:underline whitespace-nowrap"
            >
              {dayjs(post.created_at).fromNow()}
            </Link>
          </div>

          {/* Post Content */}
          {post.repost ? (
            <>
              {post.content && (
                <p className="text-neutral-800 whitespace-pre-wrap leading-7">
                  {parseHashtags(post.content)}
                </p>
              )}
              <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50 mt-2 space-y-2">
                <div className="text-sm text-neutral-500 italic">
                  🔁 {t('Reposted from')}{' '}
                  <Link href={route('posts.show', post.repost.id)} className="text-blue-600 hover:underline">
                    @{post.repost.user?.username || t('Deleted User')}
                  </Link>
                </div>
                <div className="text-neutral-800 text-sm whitespace-pre-wrap">
                  {parseHashtags(post.repost.content)}
                </div>
                {post.repost.media?.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-2">
                    {post.repost.media.map((m) => (
                      <div key={m.id} className="w-32 h-32 overflow-hidden rounded-lg">
                        {m.type === 'image' ? (
                          <img src={`/storage/${m.file_path}`} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <video className="w-full h-full object-cover" muted controls>
                            <source src={`/storage/${m.file_path}`} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-neutral-800 whitespace-pre-wrap leading-7">
              {parseHashtags(post.content)}
            </p>
          )}

          {/* Media Gallery */}
          {media.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {media.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setModalIndex(i)}
                  className="w-40 h-40 relative overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300"
                >
                  {m.type === 'image' ? (
                    <img src={`/storage/${m.file_path}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <>
                      <video className="w-full h-full object-cover" muted playsInline>
                        <source src={`/storage/${m.file_path}`} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Reactions and Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-neutral-600">
            <Reactions postId={post.id} reactions={post.likes} currentUserId={auth.user?.id} />
            <button onClick={() => setReportModalOpen(true)} className="text-red-600 hover:underline">
              📣 {t('Report')}
            </button>
            {/* {!isOwner && <RepostButton postId={post.id} />} */}
            <RepostButton postId={post.id} isOwner={isOwner} />

            {isOwner && (
              <>
                <button onClick={() => router.get(`/posts/${post.id}/edit`)} className="text-yellow-600 hover:underline">
                  ✏️ {t('Edit')}
                </button>
                <button onClick={handleDelete} className="text-red-600 hover:underline">
                  🗑️ {t('Delete')}
                </button>
              </>
            )}
          </div>

          <MediaModal media={media} index={modalIndex} onClose={(i = null) => setModalIndex(i)} />
        </>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-5 relative">
            <h2 className="text-xl font-semibold text-red-600">📣 {t('Report Post')}</h2>
            <form onSubmit={handleReportSubmit}>
              <textarea
                value={reportForm.reason}
                onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                placeholder={t('Describe the issue clearly...')}
                required
                rows={4}
                className="w-full rounded-xl border border-neutral-300 bg-white p-4 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:border-red-400 focus:ring-2 focus:ring-red-300 transition duration-200 resize-none"
              />
              <div className="mb-4">
                <label className="text-sm text-neutral-700 block mb-1">{t('Please solve: 3 + 4 =')}</label>
                <input
                  type="number"
                  value={reportForm.captcha}
                  onChange={(e) => setReportForm({ ...reportForm, captcha: e.target.value })}
                  className="w-full border border-neutral-300 p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition">
                  {t('Submit')}
                </button>
                <button type="button" onClick={() => setReportModalOpen(false)} className="text-neutral-600 hover:underline">
                  {t('Cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
