import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Category({ category, pages }) {
  const { t } = useTranslation();

  const loadMore = () => {
    if (pages.next_page_url) {
      router.visit(pages.next_page_url, { preserveScroll: true, only: ['pages'] });
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{category}</h2>}>
      <Head title={category} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {pages.data.map(page => (
          <div key={page.id} className="border-b py-2">
            <Link href={route('user_pages.show', page.slug)} className="text-lg text-blue-600">
              {page.name}
            </Link>
            <p className="text-sm text-gray-500">{page.category}</p>
          </div>
        ))}
        {pages.next_page_url && (
          <button onClick={loadMore} className="block mx-auto mt-4 text-blue-500 underline">
            {t('load_more')}
          </button>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
