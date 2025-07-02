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
  
          const likesArray = Array.isArray(comment.likes) ? [...comment.likes] : [];
  
          const existingLikeIndex = likesArray.findIndex(
            like => like.user_id === auth.user.id
          );
  
          if (existingLikeIndex !== -1) {
            likesArray.splice(existingLikeIndex, 1);
          }
  
          likesArray.push({
            user_id: auth.user.id,
            is_like: isLike,
          });
  
          return { ...comment, likes: likesArray };
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserLikeStatus = (comment) => {
    if (!auth?.user) return null;
    const userLike = comment.likes?.find(like => like.user_id === auth.user.id);
    return userLike ? userLike.is_like : null;
  };

  const renderComment = (comment) => {
    const isOwner = auth?.user?.id === comment.user_id;
    const likeCount = comment.likes?.filter(l => l.is_like).length || 0;
    const dislikeCount = comment.likes?.filter(l => !l.is_like).length || 0;
    const userLikeStatus = getUserLikeStatus(comment);

    return (
      <div key={comment.id} className="group">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200">
          {/* User Info Header */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(comment.user.name)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {comment.user.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.created_at ? formatDate(comment.created_at) : 'Just now'}
                  </p>
                </div>
                {isOwner && editingId !== comment.id && (
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={() => { setEditingId(comment.id); setEditBody(comment.body); }}
                      className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-all duration-200"
                      title="Edit comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      title="Delete comment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comment Content */}
          {editingId === comment.id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="relative">
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[100px] transition-all duration-200"
                  placeholder="Edit your comment..."
                  rows="3"
                />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setEditingId(null)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-4">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed break-words">
                {comment.body}
              </p>
            </div>
          )}

          {/* Actions */}
          {editingId !== comment.id && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleToggleLike(comment.id, true)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userLikeStatus === true 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill={userLikeStatus === true ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>{likeCount}</span>
                </button>
                
                <button 
                  onClick={() => handleToggleLike(comment.id, false)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userLikeStatus === false 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <svg className="w-4 h-4" fill={userLikeStatus === false ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  <span>{dislikeCount}</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Reply</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Comment Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Comments {comments.length > 0 && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({comments.length})
            </span>
          )}
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
        <div className="flex items-start space-x-3">
          {auth?.user && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(auth.user.name)}
              </div>
            </div>
          )}
          <div className="flex-1 space-y-4">
            <div className="relative">
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-[120px] transition-all duration-200"
                placeholder="Share your thoughts..."
                required
                rows="4"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {newBody.length}/1000
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Be respectful and constructive</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setNewBody('')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  disabled={!newBody.trim()}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newBody.trim()}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {submitting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Posting...</span>
                    </span>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No comments yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Load More Button */}
      {currentPage < lastPage && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading more...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Load more comments</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}