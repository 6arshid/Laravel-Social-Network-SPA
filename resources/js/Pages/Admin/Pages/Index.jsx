// resources/js/Pages/Admin/Pages/Index.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Index({ pages, flash }) {
  return (
    <div className="container mx-auto p-4">
      <Head title="Pages List" />
      <h1 className="text-2xl font-bold mb-4">لیست صفحات</h1>
      
      {/* دکمه رفتن به صفحه ایجاد صفحه جدید */}
      <div className="mb-4 text-right">
        <Link href={route('admin.pages.create')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          ایجاد صفحه جدید
        </Link>
      </div>

      {/* نمایش پیام موفقیت در صورت وجود */}
      {flash?.success && (
        <div className="mb-4 text-green-600 font-medium">
          {flash.success}
        </div>
      )}

      {/* جدول لیست صفحات */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">عنوان</th>
              <th className="py-2 px-4 border-b">نامک (Slug)</th>
              <th className="py-2 px-4 border-b">زبان</th>
              <th className="py-2 px-4 border-b">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.slug} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{page.title}</td>
                <td className="py-2 px-4 border-b">{page.slug}</td>
                <td className="py-2 px-4 border-b">{page.lang}</td>
                <td className="py-2 px-4 border-b">
                  {/* لینک ویرایش */}
                  <Link href={route('admin.pages.edit', page.slug)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                    ویرایش
                  </Link>
                  {/* لینک حذف */}
                  <Link
                    href={route('admin.pages.destroy', page.slug)}
                    method="delete"
                    as="button"
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={(e) => {
                      if (!confirm('آیا از حذف این صفحه مطمئن هستید؟')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    حذف
                  </Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan="4" className="py-2 px-4">هیچ صفحه‌ای وجود ندارد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
