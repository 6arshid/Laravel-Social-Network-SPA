import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Show({ page, isLiked, categories }) {
  const { t } = useTranslation();

  const toggleLike = () => {
    router.post(route('user_pages.like', page.slug));
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{page.name}</h2>}>
      <Head title={page.name} />
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <p className="text-gray-600">{page.category}</p>
        <p>{page.bio}</p>
        {page.website && (
          <p>
            <strong>{t('website')}:</strong>{' '}
            <a href={page.website} className="text-blue-600" target="_blank" rel="noopener noreferrer">
              {page.website}
            </a>
          </p>
        )}
        {page.phone_number && (
          <p>
            <strong>{t('phone_number')}:</strong> {page.phone_number}
          </p>
        )}
        {page.public_email && (
          <p>
            <strong>{t('public_email')}:</strong> {page.public_email}
          </p>
        )}
        {page.location && (
          <p>
            <strong>{t('location')}:</strong> {page.location}
          </p>
        )}
        <button onClick={toggleLike} className="bg-blue-500 text-white px-3 py-1 rounded">
          {isLiked ? t('unlike') : t('like')} ({page.likes_count})
        </button>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">{t('categories')}</h3>
          {Object.entries(categories).map(([group, cats]) => (
            <div key={group} className="mb-2">
              <p className="font-medium">{group}</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {cats.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
