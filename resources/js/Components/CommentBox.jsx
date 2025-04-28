import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function CommentBox({ post, comments: initialComments }) {
  const { t } = useTranslation();
  const { auth } = usePage().props;

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
        alert(t('You must be logged in to submit a comment.'));
        setTimeout(() => {
          router.visit('/login');
        }, 3000);
      } else {
        console.error('Error submitting comment:', err);
        alert(t('Error while submitting comment.'));
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
    if (confirm(t('Are you sure you want to delete this comment?'))) {
      router.delete(`/comments/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setComments(prev => prev.filter(c => c.id !== id));
        }
      });
    }
  };

  const handleToggleLike = async (commentId, isLike = true) => {
    try {
      await axios.post(`/comments/${commentId}/like`, { is_like: isLike });

      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id !== commentId) return comment;

          const existingLikeIndex = comment.likes.findIndex(
            like => like.user_id === auth.user.id
          );

          let updatedLikes = [...comment.likes];

          if (existingLikeIndex !== -1) {
            updatedLikes.splice(existingLikeIndex, 1);
          }

          updatedLikes.push({
            user_id: auth.user.id,
            is_like: isLike,
          });

          return { ...comment, likes: updatedLikes };
        })
      );
    } catch (error) {
      console.error('Failed to toggle like/dislike:', error);
      alert(t('Failed to like or dislike. Please try again.'));
    }
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
      console.error("Failed to load more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderComment = (comment) => {
    const isOwner = auth?.user?.id === comment.user_id;
    const likeCount = comment.likes?.filter(l => l.is_like).length || 0;
    const dislikeCount = comment.likes?.filter(l => !l.is_like).length || 0;

    return (
      <div key={comment.id} className="p-3 bg-gray-100 rounded mb-3">
        <div className="text-sm font-semibold">
          {comment.user.name}:
        </div>

        {editingId === comment.id ? (
          <form onSubmit={handleUpdate} className="mt-1">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
            <div className="mt-2 flex gap-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded">{t('Save')}</button>
              <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-400 text-white rounded">{t('Cancel')}</button>
            </div>
          </form>
        ) : (
          <p className="mt-1">{comment.body}</p>
        )}

        <div className="text-xs text-gray-600 flex gap-4 mt-2">
          <button onClick={() => handleToggleLike(comment.id, true)} className="hover:underline">
            👍 {likeCount}
          </button>
          <button onClick={() => handleToggleLike(comment.id, false)} className="hover:underline">
            👎 {dislikeCount}
          </button>

          {isOwner && editingId !== comment.id && (
            <>
              <button onClick={() => { setEditingId(comment.id); setEditBody(comment.body); }} className="text-yellow-600 hover:underline">{t('Edit')}</button>
              <button onClick={() => handleDelete(comment.id)} className="text-red-600 hover:underline">{t('Delete')}</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          className="w-full border p-3 rounded"
          placeholder={t('Write your comment...')}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {submitting ? t('Submitting...') : t('Submit Comment')}
        </button>
      </form>

      <div className="mt-4">
        {comments.map(comment => renderComment(comment))}
      </div>

      {currentPage < lastPage && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {loadingMore ? t('Loading...') : t('Load more comments')}
          </button>
        </div>
      )}
    </div>
  );
}
