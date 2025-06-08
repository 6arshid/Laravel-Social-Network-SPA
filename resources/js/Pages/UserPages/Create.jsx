import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Create({ categories }) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category: '',
    bio: '',
    website: '',
    phone_number: '',
    public_email: '',
    location: '',
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
          <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full border px-3 py-2">
            <option value="">{t('select_category')}</option>
            {Object.entries(categories).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">{t('bio')}</label>
          <textarea value={data.bio} onChange={e => setData('bio', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">{t('website')}</label>
          <input type="text" value={data.website} onChange={e => setData('website', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">{t('phone_number')}</label>
          <input type="text" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">{t('public_email')}</label>
          <input type="email" value={data.public_email} onChange={e => setData('public_email', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">{t('location')}</label>
          <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className="w-full border px-3 py-2" />
        </div>
        <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
          {t('create_page')}
        </button>
      </form>
    </AuthenticatedLayout>
  );
}
