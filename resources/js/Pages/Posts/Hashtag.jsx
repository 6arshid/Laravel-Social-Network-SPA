import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PostCard from '@/Components/PostCard';
export default function Hashtag({ hashtag, posts }) {
  return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {hashtag}
                </h2>
            }
        >
      <Head title={`#${hashtag}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
