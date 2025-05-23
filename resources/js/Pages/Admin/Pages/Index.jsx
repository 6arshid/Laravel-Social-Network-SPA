// resources/js/Pages/Admin/Pages/Index.jsx
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Index({ pages, flash }) {
  return (
    <AuthenticatedLayoutAdmin
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Pages List
        </h2>
      }
    >
      <Head title="Pages List" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">

              {/* Button to go to Create New Page */}
              <div className="mb-4 text-right">
                <Link href={route('admin.pages.create')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Create New Page
                </Link>
              </div>

              {/* Show success message if available */}
              {flash?.success && (
                <div className="mb-4 text-green-600 font-medium">
                  {flash.success}
                </div>
              )}

              {/* Pages list table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-4 border-b">Title</th>
                      <th className="py-2 px-4 border-b">Slug</th>
                      <th className="py-2 px-4 border-b">Language</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map(page => (
                      <tr key={page.slug} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{page.title}</td>
                        <td className="py-2 px-4 border-b">{page.slug}</td>
                        <td className="py-2 px-4 border-b">{page.lang}</td>
                        <td className="py-2 px-4 border-b">
                          {/* Edit link */}
                          <Link href={route('admin.pages.edit', page.slug)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">
                            Edit
                          </Link>
                          {/* Delete link */}
                          <Link
                            href={route('admin.pages.destroy', page.slug)}
                            method="delete"
                            as="button"
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this page?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {pages.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-2 px-4 text-center">No pages available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayoutAdmin>
  );
}
