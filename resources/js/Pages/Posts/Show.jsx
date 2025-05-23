import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';
import { usePage } from '@inertiajs/react';
import CommentBox from '@/Components/CommentBox';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';

export default function Show({ post, comments, similarPosts }) {
  const auth = usePage().props.auth;
  const { t } = useTranslation();

  return (
    <AuthenticatedLayout>
      <Head title={t('show_post')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm sm:rounded-lg p-6">
            
            {/* نمایش پست اصلی */}
            <PostCard post={post} />

            {/* بخش کامنت‌ها */}
            <CommentBox post={post} comments={comments} />

            {/* نمایش پست‌های مشابه */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">{t('related_posts')}</h2>
              <div className="space-y-4">
                {similarPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
