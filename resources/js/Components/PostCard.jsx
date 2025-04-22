import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import MediaModal from '@/Components/MediaModal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import parseHashtags from '@/Utils/parseHashtags';
import Reactions from '@/Components/Reactions';

dayjs.extend(relativeTime);
dayjs.locale('en');

export default function PostCard({ post }) {
  const auth = usePage().props.auth;
  const [modalIndex, setModalIndex] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', captcha: '' });
  const [captchaAnswer] = useState(7);

  const media = post.media || [];
  const isOwner = auth.user && auth.user.id === post.user_id;
  const isDeletedByReport = post.content === 'این پست به دلیل گزارش تخلف حذف شده است.';

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      router.delete(`/posts/${post.id}`);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();

    if (parseInt(reportForm.captcha) !== captchaAnswer) {
      alert('Incorrect captcha!');
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
    <div className="border rounded p-4 shadow-sm space-y-4 mt-6">
      {isDeletedByReport ? (
        <p className="text-red-600 text-center text-lg font-semibold">
          This post has been removed due to a violation report.
        </p>
      ) : (
        <>
          {/* User & Time Info */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href={route('posts.show', post.id)}
              className="text-xs hover:underline text-gray-700"
            >
              {dayjs(post.created_at).fromNow()}
            </Link>
            {post.user && (
              <>
                <span>·</span>
                <Link
                  href={route('show_profile', post.user.username)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  @{post.user.username}
                </Link>
              </>
            )}
          </div>

          {/* Content */}
          <p className="text-gray-800 whitespace-pre-wrap text-lg">
            {parseHashtags(post.content)}
          </p>

          {/* Media */}
          <div className="flex flex-wrap gap-4 mt-2">
            {media.map((m, i) => {
              const fileUrl = `/storage/${m.file_path}`;
              return (
                <button
                  key={m.id}
                  onClick={() => setModalIndex(i)}
                  className="w-40 h-40 relative overflow-hidden rounded"
                >
                  {m.type === 'image' ? (
                    <img src={fileUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <>
                      <video className="w-full h-full object-cover" muted playsInline>
                        <source src={fileUrl} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Reactions
              postId={post.id}
              reactions={post.likes}
              currentUserId={auth.user?.id}
            />

            <button onClick={() => setReportModalOpen(true)} className="text-red-600 hover:underline">
              📣 Report
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => router.get(`/posts/${post.id}/edit`)}
                  className="text-yellow-600 hover:underline"
                >
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} className="text-red-600 hover:underline">
                  🗑️ Delete
                </button>
              </>
            )}
          </div>

          <MediaModal
            media={media}
            index={modalIndex}
            onClose={(i = null) => setModalIndex(i)}
          />
        </>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded p-6 shadow-lg space-y-4 relative">
            <h2 className="text-lg font-semibold text-red-600">📣 Report Post</h2>
            <form onSubmit={handleReportSubmit}>
              <textarea
                value={reportForm.reason}
                onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                className="w-full border p-2 rounded mb-2"
                placeholder="Write your reason for reporting..."
                required
              />
              <div className="mb-3">
                <label className="text-sm text-gray-700 block mb-1">
                  Please solve: 3 + 4 =
                </label>
                <input
                  type="number"
                  value={reportForm.captcha}
                  onChange={(e) => setReportForm({ ...reportForm, captcha: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Submit Report
                </button>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="text-gray-600 hover:underline"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
