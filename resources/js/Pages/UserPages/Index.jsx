import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm, router, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export default function Index({ pages, filters, categories }) {
  const { t } = useTranslation();
  const { data, setData, get } = useForm({ search: filters.search || '' });
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const submit = () => {
    setLoading(true);
    get(route('user_pages.index'), { 
      preserveScroll: true,
      onFinish: () => setLoading(false)
    });
  };

  const loadMore = () => {
    if (pages.next_page_url) {
      setLoading(true);
      router.visit(pages.next_page_url, { 
        preserveScroll: true, 
        only: ['pages'],
        onFinish: () => setLoading(false)
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <AuthenticatedLayout 
      header={
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {t('pages')}
          </h2>
        </div>
      }
    >
      <Head title={t('pages')} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('discover_and_manage_your_pages')}
            </p>
          </div>
          
          {/* Search and Create Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            {/* Enhanced Search */}
            <div className={`relative flex-1 max-w-md transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={data.search}
                onChange={e => setData('search', e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('search_by_name_or_username')}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
              />
              <button 
                onClick={submit}
                disabled={loading}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <div className={`p-2 rounded-xl transition-all duration-200 ${loading ? 'bg-gray-100 text-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'}`}>
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
            
            {/* Enhanced Create Button */}
            <Link 
              href={route('user_pages.create')} 
              className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg shadow-md flex items-center space-x-2"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{t('create_page')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pages Grid */}
        <div className="mb-12">
          {pages.data.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_pages_found')}</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first page</p>
              <Link 
                href={route('user_pages.create')} 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('create_your_first_page')}
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pages.data.map((page, index) => (
                <div 
                  key={page.id} 
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                    
                    <Link 
                      href={route('user_pages.show', page.slug)} 
                      className="block mb-3 group-hover:text-blue-600 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {page.name}
                      </h3>
                    </Link>
                    
                    {page.category && (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {page.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {pages.next_page_url && (
            <div className="text-center mt-12">
              <button 
                onClick={loadMore} 
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 font-semibold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    {t('load_more')}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Categories Section */}
        {Object.keys(categories).length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t('categories')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Object.entries(categories).map(([group, cats], groupIndex) => (
                <div 
                  key={group} 
                  className="space-y-4"
                  style={{ animationDelay: `${groupIndex * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {group.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{group}</h4>
                  </div>
                  
                  <div className="space-y-3 pl-11">
                    {cats.map((c, index) => (
                      <Link
                        key={c}
                        href={route('user_pages.category', c.toLowerCase().replace(/\s+/g, '-'))}
                        className="group flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50"
                        style={{ animationDelay: `${(groupIndex * cats.length + index) * 0.05}s` }}
                      >
                        <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors duration-200"></div>
                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                          {c}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}