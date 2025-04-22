import React from 'react';
import { usePage, router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostCard from '@/Components/PostCard';

export default function Index({ posts }) {
  const auth = usePage().props.auth;

  const loadMore = () => {
    if (posts.next_page_url) {
      router.visit(posts.next_page_url, {
        preserveScroll: true,
        only: ['posts'],
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">My Posts</h2>}
    >
      <Head title="My Posts" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Posts</h1>
            <button
              onClick={() => router.get(route('posts.create'))}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ➕ New Post
            </button>
          </div>

          {posts.data.length === 0 && (
            <p className="text-gray-500">You haven't created any posts yet.</p>
          )}

          {posts.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {posts.next_page_url && (
            <button
              onClick={loadMore}
              className="block mx-auto mt-6 text-blue-500 underline"
            >
              Load more...
            </button>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}