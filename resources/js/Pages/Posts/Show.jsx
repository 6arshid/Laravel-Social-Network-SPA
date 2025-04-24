import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import { usePage } from '@inertiajs/react';
import CommentBox from '@/Components/CommentBox';
import PostCard from '@/Components/PostCard';

export default function Show({ post, comments, similarPosts }) {
  const auth = usePage().props.auth;

  return (
        <AuthenticatedLayout
         
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                              <PostCard post={post} />
                            {/* بخش کامنت‌ها */}
                      
                       <CommentBox post={post} comments={comments} />
                              {/* نمایش پست‌های مشابه */}
                              <div className="border-t pt-6">
                                <h2 className="text-xl font-bold mb-4">Related Posts</h2>
                                <div className="space-y-4">
                                  {similarPosts.map((p) => (
                                    <PostCard key={p.id} post={p} />
                                  ))}
                                </div>
                              </div>
                       {
                     
                       }
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
