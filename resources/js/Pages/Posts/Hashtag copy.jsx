import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PostCard from '@/Components/PostCard';

export default function Hashtag({ hashtag, posts }) {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Head title={`#${hashtag}`} />

      <h1 className="text-2xl font-bold mb-6 text-gray-800"># {hashtag}</h1>

      {posts.data.length === 0 ? (
        <p className="text-gray-500">No posts found with this hashtag.</p>
      ) : (
        posts.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      {posts.next_page_url && (
        <div className="text-center mt-6">
          <Link
            href={posts.next_page_url}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            preserveScroll
          >
            Load more
          </Link>
        </div>
      )}
    </div>
  );
}
