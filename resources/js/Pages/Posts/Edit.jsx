import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';

export default function Dashboard({ post }) {
  // Using the useForm hook for handling the edit form state and submission
  const { data, setData, put, processing, errors } = useForm({
    content: post.content,
  });

  // Handle form submission to update the post content
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/posts/${post.id}`, {
      onSuccess: () => {
        router.get(`/posts/${post.id}`); // Redirect to the updated post's page after success
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {/* Edit Post Form */}
              <div className="max-w-4xl mx-auto mt-10 p-4 border rounded space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Edit Post</h2>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Edit your post..."
                  />
                  {errors.content && (
                    <div className="text-red-500">{errors.content}</div>
                  )}

                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    disabled={processing}
                  >
                    Save Changes
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
