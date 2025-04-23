import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function RepostButton({ postId }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleRepost = () => {
    router.post(`/posts/${postId}/repost`, { content }, {
      onSuccess: () => {
        setContent('');
        setOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:underline"
      >
        🔁 Repost
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold">🔁 Repost this post</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment (optional)"
              rows={4}
              className="w-full border border-gray-300 rounded p-3 resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleRepost}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Repost
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
