import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';

export default function CommentBox({ post, comments: initialComments }) {
  const auth = usePage().props.auth;

  const [comments, setComments] = useState(initialComments?.data || []);
  const [currentPage, setCurrentPage] = useState(initialComments.current_page);
  const [lastPage, setLastPage] = useState(initialComments.last_page);
  const [loadingMore, setLoadingMore] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');

  const [newBody, setNewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newBody.trim()) return;

    setSubmitting(true);

    try {
      const response = await axios.post(`/posts/${post.id}/comments`, {
        body: newBody,
      });

      const newComment = response.data.comment;
      setComments(prev => [newComment, ...prev]);
      setNewBody('');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('You must be logged in to submit a comment.');
        setTimeout(() => {
          router.visit('/login');
        }, 3000);
      } else {
        console.error('Error submitting comment:', err);
        alert('Error while submitting comment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    router.put(`/comments/${editingId}`, { body: editBody }, {
      preserveScroll: true,
      onSuccess: () => {
        setComments(prev =>
          prev.map(comment =>
            comment.id === editingId ? { ...comment, body: editBody } : comment
          )
        );
        setEditingId(null);
        setEditBody('');
      }
    });
  };

  const handleDelete = (id) => {
    if (confirm('Delete this comment?')) {
      router.delete(`/comments/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setComments(prev => prev.filter(c => c.id !== id));
        }
      });
    }
  };

  const toggleLike = (commentId, is_like = true) => {
    router.post(`/comments/${commentId}/like`, { is_like }, {
      preserveScroll: true,
    });
  };

  const loadMore = async () => {
    if (currentPage >= lastPage) return;
    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const response = await axios.get(`/posts/${post.id}/comments?page=${nextPage}`);

      const newData = response.data.data;
      const newCurrentPage = response.data.current_page;
      const newLastPage = response.data.last_page;

      setComments(prev => [...prev, ...newData.reverse()]);
      setCurrentPage(newCurrentPage);
      setLastPage(newLastPage);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderComment = (comment) => {
    const isOwner = auth.user && auth.user.id === comment.user_id;
    const likeCount = comment.likes?.filter(l => l.is_like).length || 0;
    const dislikeCount = comment.likes?.filter(l => !l.is_like).length || 0;

    return (
      <div key={comment.id} className="p-3 bg-gray-100 rounded mb-3">
        <div className="text-sm">
          <strong>{comment.user.name}</strong>:
          {editingId === comment.id ? (
            <form onSubmit={handleUpdate}>
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full mt-1 p-1 border rounded"
              />
              <div className="mt-1 flex gap-2">
                <button className="text-blue-500">Save</button>
                <button type="button" onClick={() => setEditingId(null)} className="text-gray-500">Cancel</button>
              </div>
            </form>
          ) : (
            <span className="ml-1">{comment.body}</span>
          )}
        </div>

        <div className="text-xs text-gray-600 flex flex-wrap gap-4 mt-1">
          <button onClick={() => toggleLike(comment.id, true)} className="hover:underline">👍 {likeCount}</button>
          <button onClick={() => toggleLike(comment.id, false)} className="hover:underline">👎 {dislikeCount}</button>

          {isOwner && editingId !== comment.id && (
            <>
              <button onClick={() => { setEditingId(comment.id); setEditBody(comment.body); }} className="text-yellow-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(comment.id)} className="text-red-600 hover:underline">Delete</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Write a comment..."
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          {submitting ? 'Sending...' : 'Submit'}
        </button>
      </form>

      <div className="mt-4">
        {comments.map(comment => renderComment(comment))}
      </div>

      {currentPage < lastPage && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 text-blue-500 underline"
        >
          {loadingMore ? 'Loading...' : 'Load more comments...'}
        </button>
      )}
    </div>
  );
}
