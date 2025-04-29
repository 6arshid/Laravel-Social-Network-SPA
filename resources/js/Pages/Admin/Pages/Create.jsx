import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

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
    <div className="container mx-auto p-4 max-w-xl">
      <Head title="ایجاد صفحه جدید" />
      <h1 className="text-2xl font-bold mb-4">ایجاد صفحه جدید</h1>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            ذخیره
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
