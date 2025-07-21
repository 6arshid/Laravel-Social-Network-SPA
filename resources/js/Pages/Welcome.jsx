import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { t } = useTranslation();

    const features = [
        {
            title: t('laravel_social_network'),
            description: t('social_network_description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
            ),
            gradient: 'from-blue-600 to-purple-600',
            bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20'
        },
        {
            title: t('follow_system'),
            description: t('follow_system_description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="currentColor"/>
                </svg>
            ),
            gradient: 'from-emerald-600 to-teal-600',
            bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
        },
        {
            title: t('messaging'),
            description: t('messaging_description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
                </svg>
            ),
            gradient: 'from-orange-600 to-red-600',
            bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
        },
        {
            title: t('place_chat'),
            description: t('place_chat_description'),
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
            ),
            gradient: 'from-pink-600 to-rose-600',
            bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20'
        }
    ];

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10">
                    {/* Header */}
                    <header className="container mx-auto px-6 py-8">
                        <nav className="flex items-center justify-between">
                            {/* Language Switcher */}
                            <div className="flex items-center">
                                <LanguageSwitcher />
                            </div>

                            {/* Logo */}
                            <Link href="/" className="flex items-center group">
                                <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <ApplicationLogo className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                </div>
                            </Link>

                            {/* Auth Links */}
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </header>

                    {/* Hero Section */}
                    <section className="container mx-auto px-6 py-16 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-8 leading-tight">
                                {t('social_network')}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                                {t('hero_description')}
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                                >
                                    <span>{auth.user ? t('dashboard') : t('get_started')}</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <button className="px-8 py-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-800 dark:text-gray-200 rounded-2xl font-bold text-lg border border-white/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300">
                                    {t('learn_more')}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="container mx-auto px-6 py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                {t('powerful_features')}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                {t('features_description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group relative p-8 rounded-3xl bg-gradient-to-br ${feature.bgGradient} border border-white/20 dark:border-gray-700/20 backdrop-blur-sm hover:scale-105 transition-all duration-500 hover:shadow-2xl`}
                                >
                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    
                                    {/* Content */}
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 to-white/5 dark:from-gray-800/0 dark:to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="container mx-auto px-6 py-16">
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-16 border border-white/20 dark:border-gray-700/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="group">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                                        1M+
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('active_users')}</div>
                                </div>
                                <div className="group">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                                        50M+
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('messages_sent')}</div>
                                </div>
                                <div className="group">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                                        99.9%
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('uptime')}</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="container mx-auto px-6 py-16">
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                                }}></div>
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    {t('ready_to_get_started')}
                                </h2>
                                <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                                    {t('join_millions')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        {t('create_account')}
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                                    >
                                        {t('sign_in')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="container mx-auto px-6 py-12 text-center">
                        <div className="text-gray-600 dark:text-gray-400">
                            <p className="mb-4">
                                {t('built_with_versions', { laravelVersion, phpVersion })}
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">{t('privacy_policy')}</a>
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">{t('terms_of_service')}</a>
                                <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">{t('contact_us')}</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}