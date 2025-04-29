// resources/js/Pages/Admin/Pages/Create.jsx
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';

export default function Create({ languages }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    slug: '',
    content: '',
    lang: languages[0]?.code || ''
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.pages.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <AuthenticatedLayoutAdmin
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Create New Page
        </h2>
      }
    >
      <Head title="Create New Page" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="container mx-auto p-4 max-w-xl">
                <form onSubmit={submit}>
                  {/* Title field */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Page Title:</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={e => setData('title', e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                  </div>

                  {/* Slug field */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Slug:</label>
                    <input
                      type="text"
                      value={data.slug}
                      onChange={e => setData('slug', e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    />
                    {errors.slug && <div className="text-red-600 text-sm mt-1">{errors.slug}</div>}
                  </div>

                  {/* Language field */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Language:</label>
                    <select
                      value={data.lang}
                      onChange={e => setData('lang', e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.code})
                        </option>
                      ))}
                    </select>
                    {errors.lang && <div className="text-red-600 text-sm mt-1">{errors.lang}</div>}
                  </div>

                  {/* Content field */}
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Content:</label>
                    <textarea
                      value={data.content}
                      onChange={e => setData('content', e.target.value)}
                      className="w-full border px-3 py-2 rounded h-32"
                    />
                    {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={processing}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <Link
                      href={route('admin.pages.index')}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayoutAdmin>
  );
}
