import React from 'react';
import { Inertia } from '@inertiajs/inertia';

const getImageUrl = (path) => `/storage/${path}`;

export default function Private({ user, isFollowing, hasPendingRequest }) {
  const sendFollowRequest = () => {
    Inertia.post(route('follow.toggle', user.username));
  };

  const cancelFollowRequest = () => {
    Inertia.post(route('follow.toggle', user.username));
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <div className="flex justify-center mt-6">
        {user?.avatar ? (
          <img
            src={getImageUrl(user.avatar)}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
          />
        ) : (
          <img
            src="/default-avatar.png"
            alt="default avatar"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
          />
        )}
      </div>

      <h1 className="text-2xl font-bold mt-4">This profile is private</h1>
      <p className="text-gray-600 mt-2">You must follow @{user.username} to view their content.</p>

      {!isFollowing && (
        hasPendingRequest ? (
          <button
            onClick={cancelFollowRequest}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel Follow Request
          </button>
        ) : (
          <button
            onClick={sendFollowRequest}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Follow Request
          </button>
        )
      )}

      {isFollowing && (
        <div className="mt-4">
          <p className="text-green-500">You are following this user.</p>
          <button
            onClick={cancelFollowRequest}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Unfollow
          </button>
        </div>
      )}
    </div>
  );
}
