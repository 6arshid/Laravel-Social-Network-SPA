import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { t } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' || 
               (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = () => {
        axios.get('/notifications')
            .then((res) => {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unread_count);
            })
            .catch((err) => {
                console.error('خطا در گرفتن نوتیف:', err);
            });
    };

    const markAsRead = (id) => {
        axios.post(`/notifications/read/${id}`).then(() => {
            fetchNotifications();
        });
    };

    const markAllAsRead = () => {
        axios.post('/notifications/read-all').then(() => {
            fetchNotifications();
        });
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Navigation */}
            <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo & Navigation Links */}
                        <div className="flex items-center space-x-8">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="group">
                                    <ApplicationLogo className="block h-10 w-auto text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200" />
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {user.is_admin === 1 && (
                                    <NavLink 
                                        href="/admin/panel" 
                                        active={route().current('admin.panel')}
                                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/>
                                                <path d="M12 12L2 7L12 2L22 7L12 12Z"/>
                                                <path d="M2 17L12 12L22 17"/>
                                            </svg>
                                            <span>Admin Panel</span>
                                        </div>
                                    </NavLink>
                                )}
                                <NavLink 
                                    href={route('dashboard')} 
                                    active={route().current('dashboard')}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7"/>
                                            <rect x="14" y="3" width="7" height="7"/>
                                            <rect x="14" y="14" width="7" height="7"/>
                                            <rect x="3" y="14" width="7" height="7"/>
                                        </svg>
                                        <span>Dashboard</span>
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        {/* Desktop Right Side */}
                        <div className="hidden lg:flex items-center space-x-4">
                           

                            {/* Notifications */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="notification-button relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"/>
                                        <path d="M13.73 21A2 2 0 0110.27 21"/>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="notification-dropdown absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl z-50 max-h-96 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            {notifications.length > 0 && (
                                                <button 
                                                    onClick={markAllAsRead}
                                                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"/>
                                                        <path d="M13.73 21A2 2 0 0110.27 21"/>
                                                    </svg>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif, index) => (
                                                    <Link
                                                        key={notif.id}
                                                        href={notif.link || '#'}
                                                        onClick={() => markAsRead(notif.id)}
                                                        className={`block px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                                            notif.read 
                                                                ? 'text-gray-600 dark:text-gray-400' 
                                                                : 'text-gray-900 dark:text-white bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500'
                                                        } ${index === notifications.length - 1 ? 'border-b-0' : ''}`}
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-indigo-500'}`}></div>
                                                            <div className="flex-1">
                                                                <p className={notif.read ? '' : 'font-medium'}>{notif.message}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    {new Date(notif.created_at).toLocaleDateString('fa-IR')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="font-medium truncate max-w-32">{user.name}</span>
                                        <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9L12 15L18 9"/>
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content className="w-56 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <Dropdown.Link 
                                        href={route('show_profile', { username: user.username })}
                                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21V19A4 4 0 0016 15H8A4 4 0 004 19V21"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        <span>{t('YourProfile')}</span>
                                    </Dropdown.Link>
                                    <Dropdown.Link 
                                        href={route('profile.edit')}
                                        className="flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4A2 2 0 002 6V18A2 2 0 004 20H16A2 2 0 0018 18V13"/>
                                            <path d="M18.5 2.5A2.121 2.121 0 0121 5L12 14L8 15L9 11L18.5 2.5Z"/>
                                        </svg>
                                        <span>Edit Profile</span>
                                    </Dropdown.Link>
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <Dropdown.Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button"
                                            className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5A2 2 0 013 19V5A2 2 0 015 3H9"/>
                                                <polyline points="16,17 21,12 16,7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            <span>Log Out</span>
                                        </Dropdown.Link>
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center space-x-3 lg:hidden">
                            {/* Mobile Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                            >
                                {darkMode ? (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="5"/>
                                        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z"/>
                                    </svg>
                                )}
                            </button>

                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path 
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M4 6h16M4 12h16M4 18h16" 
                                    />
                                    <path 
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M6 18L18 6M6 6l12 12" 
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl`}>
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {user.is_admin === 1 && (
                            <ResponsiveNavLink 
                                href="/admin/panel" 
                                active={route().current('admin.panel')}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/>
                                    <path d="M12 12L2 7L12 2L22 7L12 12Z"/>
                                    <path d="M2 17L12 12L22 17"/>
                                </svg>
                                <span>Admin Panel</span>
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink 
                            href={route('dashboard')} 
                            active={route().current('dashboard')}
                            className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"/>
                                <rect x="14" y="3" width="7" height="7"/>
                                <rect x="14" y="14" width="7" height="7"/>
                                <rect x="3" y="14" width="7" height="7"/>
                            </svg>
                            <span>Dashboard</span>
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pb-1 pt-4">
                        {/* Mobile User Info */}
                        <div className="flex items-center px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 mx-4 rounded-xl mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</div>
                            </div>
                            {/* Mobile Notifications */}
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"/>
                                        <path d="M13.73 21A2 2 0 0110.27 21"/>
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1 px-4">
                            <ResponsiveNavLink 
                                href={route('show_profile', { username: user.username })}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21V19A4 4 0 0016 15H8A4 4 0 004 19V21"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                <span>{t('YourProfile')}</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink 
                                href={route('profile.edit')}
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4A2 2 0 002 6V18A2 2 0 004 20H16A2 2 0 0018 18V13"/>
                                    <path d="M18.5 2.5A2.121 2.121 0 0121 5L12 14L8 15L9 11L18.5 2.5Z"/>
                                </svg>
                                <span>Edit Profile</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink 
                                method="post" 
                                href={route('logout')} 
                                as="button"
                                className="flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5A2 2 0 013 19V5A2 2 0 015 3H9"/>
                                    <polyline points="16,17 21,12 16,7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                <span>Log Out</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Floating Action Button for Mobile Notifications */}
            <div className="fixed bottom-6 right-6 lg:hidden z-30">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="notification-button relative p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"/>
                        <path d="M13.73 21A2 2 0 0110.27 21"/>
                    </svg>
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Mobile Notifications Panel */}
                {showNotifications && (
                    <div className="notification-dropdown absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl max-h-96 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z"/>
                                        <path d="M13.73 21A2 2 0 0110.27 21"/>
                                    </svg>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif, index) => (
                                    <Link
                                        key={notif.id}
                                        href={notif.link || '#'}
                                        onClick={() => markAsRead(notif.id)}
                                        className={`block px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                            notif.read 
                                                ? 'text-gray-600 dark:text-gray-400' 
                                                : 'text-gray-900 dark:text-white bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500'
                                        } ${index === notifications.length - 1 ? 'border-b-0' : ''}`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-indigo-500'}`}></div>
                                            <div className="flex-1">
                                                <p className={notif.read ? '' : 'font-medium'}>{notif.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {new Date(notif.created_at).toLocaleDateString('fa-IR')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}