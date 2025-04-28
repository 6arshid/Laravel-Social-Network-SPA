import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ post }) {
  const { data, setData, put, processing, errors } = useForm({
    content: post.content,
  });
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/posts/${post.id}`, {
      onSuccess: () => {
        router.get(`/posts/${post.id}`);
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {t('dashboard')}
        </h2>
      }
    >
      <Head title={t('dashboard')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="max-w-4xl mx-auto mt-10 p-4 border rounded space-y-6">
                <h2 className="text-xl font-bold text-gray-800">{t('edit_post')}</h2>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={t('edit_your_post_placeholder')}
                  />
                  {errors.content && (
                    <div className="text-red-500">{errors.content}</div>
                  )}

                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    disabled={processing}
                  >
                    {t('save_changes')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}