import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Settings() {
  const { props } = usePage();
  const google = props.google;
  const appName = props.app_name;
  const mail = props.mail;
  const pwa = props.pwa;
  const [logo, setLogo] = useState(null);
  const [pwaIcon, setPwaIcon] = useState(null);
  const [tab, setTab] = useState('logo');
  const maxUploadSize = props.max_upload_size;

  const handleSubmitLogo = (e) => {
    e.preventDefault();
    if (!logo) return;
    const formData = new FormData();
    formData.append('logo', logo);
    router.post('/admin/upload-logo', formData, {
      forceFormData: true,
      onSuccess: () => alert('Logo uploaded successfully.')
    });
  };

  const handleSubmitPwaIcon = (e) => {
    e.preventDefault();
    if (!pwaIcon) return;
    const formData = new FormData();
    formData.append('icon', pwaIcon);
    router.post('/admin/upload-pwa-icon', formData, {
      forceFormData: true,
      onSuccess: () => alert('PWA Icon updated successfully.')
    });
  };

  return (
    <AuthenticatedLayoutAdmin header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Settings</h2>}>
      <Head title="Settings" />
      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 bg-white p-6 rounded-xl shadow">

          {/* Tabs */}
          <div className="flex border-b mb-6">
          {['logo', 'app', 'mail', 'google', 'pwa', 'maxupload'].map((key) => (
  <button
    key={key}
    onClick={() => setTab(key)}
    className={`px-4 py-2 border-b-2 ${tab === key ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-600'}`}
  >
    {key === 'logo' && 'Upload Logo'}
    {key === 'app' && 'App Name'}
    {key === 'mail' && 'Mail Settings'}
    {key === 'google' && 'Google Login'}
    {key === 'pwa' && 'PWA Settings'}
    {key === 'maxupload' && 'Max Upload'}
  </button>
))}

          </div>

          {/* Upload Logo */}
          {tab === 'logo' && (
            <form onSubmit={handleSubmitLogo}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Upload Logo</label>
                <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} className="w-full" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload</button>
            </form>
          )}

          {/* App Name */}
          {tab === 'app' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              router.post('/admin/settings/update-app-name', {
                app_name: formData.get('app_name')
              });
            }}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">App Name</label>
                <input type="text" name="app_name" defaultValue={appName} className="w-full border px-3 py-2 rounded" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            </form>
          )}

          {/* Mail Settings */}
          {tab === 'mail' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              router.post('/admin/settings/update-mail', {
                mail_host: formData.get('mail_host'),
                mail_port: formData.get('mail_port'),
                mail_username: formData.get('mail_username'),
                mail_password: formData.get('mail_password'),
                mail_from_address: formData.get('mail_from_address'),
                mail_from_name: formData.get('mail_from_name'),
              });
            }}>
              {[{
                label: 'Mail Host', name: 'mail_host', type: 'text', value: mail?.host
              }, {
                label: 'Mail Port', name: 'mail_port', type: 'number', value: mail?.port
              }, {
                label: 'Username', name: 'mail_username', type: 'text', value: mail?.username
              }, {
                label: 'Password', name: 'mail_password', type: 'text', value: mail?.password
              }, {
                label: 'From Address', name: 'mail_from_address', type: 'email', value: mail?.from_address
              }, {
                label: 'From Name', name: 'mail_from_name', type: 'text', value: mail?.from_name
              }].map(field => (
                <div className="mb-4" key={field.name}>
                  <label className="block mb-1 font-semibold">{field.label}</label>
                  <input type={field.type} name={field.name} defaultValue={field.value} className="w-full border px-3 py-2 rounded" />
                </div>
              ))}
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            </form>
          )}

          {/* Google Login */}
          {tab === 'google' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              router.post('/admin/settings/update-google', {
                client_id: formData.get('client_id'),
                client_secret: formData.get('client_secret'),
                redirect_uri: formData.get('redirect_uri')
              });
            }}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Client ID</label>
                <input type="text" name="client_id" defaultValue={google?.client_id} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Client Secret</label>
                <input type="text" name="client_secret" defaultValue={google?.client_secret} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Redirect URI</label>
                <input type="url" name="redirect_uri" defaultValue={google?.redirect_uri} className="w-full border px-3 py-2 rounded" />
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
            </form>
          )}

          {/* PWA Settings */}
          {tab === 'pwa' && (
            <>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                router.post('/admin/settings/update-pwa', {
                  install_button: formData.get('install_button') === 'on',
                  name: formData.get('name'),
                  short_name: formData.get('short_name'),
                  background_color: formData.get('background_color'),
                  display: formData.get('display'),
                  description: formData.get('description'),
                  theme_color: formData.get('theme_color'),
                  icon: formData.get('icon')
                });
              }}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Enable Install Button</label>
                  <input type="checkbox" name="install_button" defaultChecked={pwa?.install_button === 'true' || pwa?.install_button === true} className="h-4 w-4" />
                </div>
                {[{
                  label: 'App Name', name: 'name', value: pwa?.name
                }, {
                  label: 'Short Name', name: 'short_name', value: pwa?.short_name
                }, {
                  label: 'Description', name: 'description', value: pwa?.description
                }, {
                  label: 'Display', name: 'display', value: pwa?.display
                }, {
                  label: 'Background Color', name: 'background_color', value: pwa?.background_color
                }, {
                  label: 'Theme Color', name: 'theme_color', value: pwa?.theme_color
                }, {
                  label: 'App Icon Filename', name: 'icon', value: pwa?.icon
                }].map((field) => (
                  <div className="mb-4" key={field.name}>
                    <label className="block mb-1 font-semibold">{field.label}</label>
                    <input type="text" name={field.name} defaultValue={field.value} className="w-full border px-3 py-2 rounded" />
                  </div>
                ))}
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
              </form>
              <form onSubmit={handleSubmitPwaIcon} className="mt-6">
                <label className="block mb-1 font-semibold">Upload New PWA Icon (pwa.png) , Please make sure that the icon must be 512x512</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPwaIcon(e.target.files[0])}
                  className="mb-4 block"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Upload Icon
                </button>
              </form>
            </>
          )}
{tab === 'maxupload' && (
  <form onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    router.post('/admin/settings/update-maxupload', {
      max_upload_size: formData.get('max_upload_size'),
    });
  }}>
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Max Upload Size (KB)</label>
      <input
        type="number"
        name="max_upload_size"
        defaultValue={maxUploadSize}
        min={1}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
      Save
    </button>
  </form>
)}
        </div>
      </div>
    </AuthenticatedLayoutAdmin>
  );
}