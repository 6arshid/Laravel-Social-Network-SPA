// resources/js/Pages/Profile/Private.jsx

import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function Private({ user, isFollowing, hasPendingRequest }) {
  const sendFollowRequest = () => {
    Inertia.post(route('follow.toggle', user.username));
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold">This profile is private</h1>
      <p className="text-gray-600 mt-2">You must follow @{user.username} to view their content.</p>

      {!isFollowing && !hasPendingRequest && (
        <button
          onClick={sendFollowRequest}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Follow Request
        </button>
      )}

      {hasPendingRequest && (
        <p className="mt-4 text-gray-500">Follow request sent. Waiting for approval.</p>
      )}

      {isFollowing && (
        <p className="mt-4 text-green-500">You are following this user.</p>
      )}
    </div>
  );
}
