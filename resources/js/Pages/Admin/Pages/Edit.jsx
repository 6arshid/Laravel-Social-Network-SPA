import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ page, languages }) {
  const { data, setData, put, processing, errors } = useForm({
    title: page.title || '',
    slug: page.slug || '',
    content: page.content || '',
    lang: page.lang || ''
  });

  const submit = (e) => {
    e.preventDefault();
    put(route('admin.pages.update', page.id));
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Head title={`ویرایش صفحه ${page.title}`} />
      <h1 className="text-2xl font-bold mb-4">ویرایش صفحه "{page.title}"</h1>
      <form onSubmit={submit}>
        {/* فیلد عنوان */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">عنوان صفحه:</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={e => setData('title', e.target.value)} 
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
        </div>

        {/* فیلد Slug */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">نامک (Slug):</label>
          <input 
            type="text" 
            value={data.slug} 
            onChange={e => setData('slug', e.target.value)} 
            className="w-full border px-3 py-2 rounded"
          />
          {errors.slug && <div className="text-red-600 text-sm mt-1">{errors.slug}</div>}
        </div>

        {/* فیلد زبان */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">زبان:</label>
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

        {/* فیلد محتوا */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">محتوا:</label>
          <textarea 
            value={data.content} 
            onChange={e => setData('content', e.target.value)} 
            className="w-full border px-3 py-2 rounded h-32"
          />
          {errors.content && <div className="text-red-600 text-sm mt-1">{errors.content}</div>}
        </div>

        {/* دکمه‌ها */}
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            disabled={processing} 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            به‌روزرسانی
          </button>
          <Link 
            href={route('admin.pages.index')} 
            className="text-gray-600 hover:underline"
          >
            لغو
          </Link>
        </div>
      </form>
    </div>
  );
}
