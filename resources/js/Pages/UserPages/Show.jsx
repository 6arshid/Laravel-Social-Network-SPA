import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, Head, usePage } from '@inertiajs/react';
import PostForm from '@/Components/PostForm';
import PostCard from '@/Components/PostCard';
import { useTranslation } from 'react-i18next';

export default function Show({ page, isLiked, posts }) {
  const { t } = useTranslation();
  const auth = usePage().props.auth;

  const toggleLike = () => {
    router.post(route('user_pages.like', page.slug));
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{page.name}</h2>}>
      <Head title={page.name} />
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {page.category && (
          <p className="text-gray-600">
            <Link
              href={route('user_pages.category', page.category.toLowerCase().replace(/\s+/g, '-'))}
              className="hover:underline"
            >
              {page.category}
            </Link>
          </p>
        )}
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
        <div className="flex items-center gap-2">
          <button onClick={toggleLike} className="bg-blue-500 text-white px-3 py-1 rounded">
            {isLiked ? t('unlike') : t('like')} ({page.likes_count})
          </button>
          {auth.user && auth.user.id === page.user_id && (
            <Link href={route('user_pages.edit', page.slug)} className="bg-yellow-500 text-white px-3 py-1 rounded">
              {t('edit_page')}
            </Link>
          )}
        </div>

        {auth.user && auth.user.id === page.user_id && (
          <PostForm action={route('user_pages.posts.store', page.slug)} />
        )}

        <div className="space-y-4 mt-6">
          {posts.data.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {posts.next_page_url && (
            <button
              onClick={() => router.visit(posts.next_page_url, { preserveScroll: true, only: ['posts'] })}
              className="block mx-auto text-blue-600 underline"
            >
              {t('load_more')}
            </button>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
