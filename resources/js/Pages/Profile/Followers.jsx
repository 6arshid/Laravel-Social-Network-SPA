import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Followers() {
  const { user, followers } = usePage().props;

  const handleRemoveFollower = (username) => {
    if (confirm('Are you sure you want to remove this follower?')) {
      Inertia.post(route('follow.remove_follower', username));
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-xl font-bold mb-4">Your Followers</h1>
        {followers.data.map(f => (
          <div key={f.id} className="p-4 border-b flex justify-between items-center">
            <Link href={route('show_profile', f.username)} className="flex items-center space-x-4">
              <img src={f.avatar ? `/storage/${f.avatar}` : '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold hover:underline">{f.name}</p>
                <p className="text-gray-500 text-sm">@{f.username}</p>
              </div>
            </Link>
            <button
              onClick={() => handleRemoveFollower(f.username)}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="mt-4 flex space-x-2">
          {followers.links.map((link, i) => (
            <Link
              key={i}
              href={link.url || '#'}
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-3 py-1 border text-sm rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
