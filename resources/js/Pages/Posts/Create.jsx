import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PostForm from '@/Components/PostForm';
import { useTranslation } from 'react-i18next';

export default function Create() {
  const { t } = useTranslation();
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {t('create_new_post')}
        </h2>
      }
    >
      <Head title={t('create_new_post')} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{t('create_a_new_post')}</h1>
            <PostForm />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}