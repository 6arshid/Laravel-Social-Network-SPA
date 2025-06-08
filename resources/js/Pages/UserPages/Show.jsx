import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Show({ page, isLiked }) {
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
        <button onClick={toggleLike} className="bg-blue-500 text-white px-3 py-1 rounded">
          {isLiked ? t('unlike') : t('like')} ({page.likes_count})
        </button>
      </div>
    </AuthenticatedLayout>
  );
}
