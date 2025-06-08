import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Create() {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category: '',
    bio: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('user_pages.store'));
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{t('create_page')}</h2>}>
      <Head title={t('create_page')} />
      <form onSubmit={submit} className="max-w-xl mx-auto space-y-4 p-6 bg-white rounded shadow">
        <div>
          <label className="block mb-1">{t('page_name')}</label>
          <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border px-3 py-2" />
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        </div>
        <div>
          <label className="block mb-1">{t('page_category')}</label>
          <input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">{t('bio')}</label>
          <textarea value={data.bio} onChange={e => setData('bio', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
          {t('create_page')}
        </button>
      </form>
    </AuthenticatedLayout>
  );
}
