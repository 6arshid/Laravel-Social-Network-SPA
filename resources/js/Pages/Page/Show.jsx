// resources/js/Pages/Page/Show.jsx
import React from 'react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ page }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                   {page.title}
                </h2>
            }
        >
      <Head title={page.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                             {page.content}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
