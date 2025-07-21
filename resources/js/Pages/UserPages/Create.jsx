import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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

  const [focusedField, setFocusedField] = useState('');

  const submit = (e) => {
    e.preventDefault();
    post(route('user_pages.store'));
  };

  const renderInput = (field, type = 'text', placeholder = '', icon = null) => {
    const isTextarea = type === 'textarea';
    const hasError = errors[field];
    const isFocused = focusedField === field;

    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          {icon && (
            <div className="w-5 h-5 mr-2 text-blue-600">
              {icon}
            </div>
          )}
          {t(field)}
          {field === 'name' && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          {isTextarea ? (
            <textarea
              value={data[field]}
              onChange={e => setData(field, e.target.value)}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField('')}
              placeholder={placeholder || t(`enter_${field}`)}
              rows={4}
              className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl transition-all duration-300 resize-none
                ${hasError 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : isFocused 
                    ? 'border-blue-500 bg-blue-50 focus:ring-4 focus:ring-blue-100' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } focus:outline-none shadow-sm hover:shadow-md`}
            />
          ) : (
            <input
              type={type}
              value={data[field]}
              onChange={e => setData(field, e.target.value)}
              onFocus={() => setFocusedField(field)}
              onBlur={() => setFocusedField('')}
              placeholder={placeholder || t(`enter_${field}`)}
              className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl transition-all duration-300
                ${hasError 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                  : isFocused 
                    ? 'border-blue-500 bg-blue-50 focus:ring-4 focus:ring-blue-100' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } focus:outline-none shadow-sm hover:shadow-md`}
            />
          )}
          
          {/* Success checkmark for filled fields */}
          {data[field] && !hasError && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        {hasError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm animate-shake">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors[field]}</span>
          </div>
        )}
      </div>
    );
  };

  const renderCategorySelect = () => {
    const hasError = errors.category;
    const isFocused = focusedField === 'category';

    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <div className="w-5 h-5 mr-2 text-blue-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          {t('page_category')}
        </label>
        
        <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
          <select
            value={data.category}
            onChange={e => setData('category', e.target.value)}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField('')}
            className={`w-full px-4 py-3 text-gray-700 border-2 rounded-xl transition-all duration-300 appearance-none
              ${hasError 
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : isFocused 
                  ? 'border-blue-500 bg-blue-50 focus:ring-4 focus:ring-blue-100' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } focus:outline-none shadow-sm hover:shadow-md`}
          >
            <option value="">{t('select_category')}</option>
            {Object.entries(categories).map(([group, cats]) => (
              <optgroup key={group} label={group} className="font-semibold">
                {cats.map((c) => (
                  <option key={c} value={c} className="font-normal">{c}</option>
                ))}
              </optgroup>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {hasError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm animate-shake">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errors.category}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <AuthenticatedLayout 
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {t('create_page')}
            </h2>
          </div>
          
          <Link 
            href={route('user_pages.index')} 
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">{t('back_to_pages')}</span>
          </Link>
        </div>
      }
    >
      <Head title={t('create_page')} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('create_new_page')}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('fill_out_the_form_below_to_create_your_new_page')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('page_information')}</h3>
                <p className="text-gray-600">{t('fill_all_the_details_below')}</p>
              </div>
              
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Basic Information Section */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    {renderInput('name', 'text', t('enter_your_page_name'), (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    ))}
                    
                    <div>{renderCategorySelect()}</div>
                  </div>
                  
                  {renderInput('bio', 'textarea', t('describe_your_page'), (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ))}
                </div>
                
                {/* Contact Information Section */}
                <div className="lg:col-span-2">
                  <div className="border-t border-gray-200 pt-8 mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t('contact_information')}</h4>
                    <p className="text-gray-600">{t('optional_contact_details')}</p>
                  </div>
                  
                  <div className="grid gap-8 lg:grid-cols-2">
                    {renderInput('website', 'url', 'https://example.com', (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0-9c-1.657 0-3 .895-3 2v5c0 1.105 1.343 2 3 2m0-9c1.657 0 3 .895 3 2v5c0-1.105-1.343-2-3-2" />
                      </svg>
                    ))}
                    
                    {renderInput('phone_number', 'tel', '+1 (555) 123-4567', (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ))}
                    
                    {renderInput('public_email', 'email', 'contact@example.com', (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ))}
                    
                    {renderInput('location', 'text', t('city_country'), (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit */}
          <div className="bg-gray-50 px-8 py-6 lg:px-12 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={processing}
                className="flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold hover:scale-105 shadow-lg disabled:scale-100 text-lg"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t('creating')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>{t('create_page')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}