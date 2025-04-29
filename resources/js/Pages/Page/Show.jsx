// resources/js/Pages/Page/Show.jsx
import React from 'react';
import { Head } from '@inertiajs/react';

export default function Show({ page }) {
  return (
    <div className="container mx-auto p-6">
      <Head title={page.title} />
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div className="content leading-relaxed">
        {page.content}
      </div>
    </div>
  );
}
