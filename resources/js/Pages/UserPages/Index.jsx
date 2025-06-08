import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm, router, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Index({ pages, filters, categories }) {
  const { t } = useTranslation();
  const { data, setData, get } = useForm({ search: filters.search || '' });

  const submit = () => {
    get(route('user_pages.index'), { preserveScroll: true });
  };

  const loadMore = () => {
    if (pages.next_page_url) {
      router.visit(pages.next_page_url, { preserveScroll: true, only: ['pages'] });
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{t('pages')}</h2>}>
      <Head title={t('pages')} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between mb-4">
          <form onSubmit={e => { e.preventDefault(); submit(); }} className="flex space-x-2">
            <input
              type="text"
              value={data.search}
              onChange={e => setData('search', e.target.value)}
              placeholder={t('search_by_name_or_username')}
              className="border rounded px-3 py-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-3 py-2 rounded">{t('search')}</button>
          </form>
          <Link href={route('user_pages.create')} className="bg-green-500 text-white px-3 py-2 rounded">
            {t('create_page')}
          </Link>
        </div>

        {pages.data.length === 0 && <p className="text-gray-500">{t('no_pages_found')}</p>}
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

        <div className="mt-8">
          <h3 className="font-semibold mb-2">{t('categories')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(categories).map(([group, cats]) => (
              <div key={group}>
                <p className="font-medium mb-1">{group}</p>
                <div className="space-y-1">
                  {cats.map((c) => (
                    <Link
                      key={c}
                      href={route('user_pages.category', c.toLowerCase().replace(/\s+/g, '-'))}
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
