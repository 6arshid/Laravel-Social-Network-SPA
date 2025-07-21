import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true' || 
                   (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });
    const { t } = useTranslation();
    const pages = usePage().props.pagesByLang;

    // Dark mode toggle
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Initialize dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleFollowAction = (followerId, action, notifId) => {
        axios.post(`/follow/${user.username}/${action}`, { follower_id: followerId })
            .then(() => {
                markAsRead(notifId);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = () => {
        axios.get('/notifications')
            .then((res) => {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unread_count);
            })
            .catch((err) => {
                console.error('Error fetching notifications:', err);
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

    const MenuLink = ({ href, active, icon, children, badge }) => (
        <Link
            href={href}
            className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ease-in-out hover:scale-[1.02] ${
                active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
        >
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors duration-200 ${
                    active 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                }`}>
                    {icon}
                </div>
                <span className="font-medium">{children}</span>
            </div>
            {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {badge}
                </span>
            )}
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <ApplicationLogo className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold text-white">Dashboard</span>
                    </Link>
                    <button
                        className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Profile Section */}
                {user && (
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {user && (
                        <>
                            {user.is_admin === 1 && (
                                <MenuLink
                                    href="/admin/panel"
                                    active={route().current('admin.panel')}
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    }
                                >
                                    {t('AdminPanel')}
                                </MenuLink>
                            )}

                            <MenuLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5v6m4-6v6m4-6v6" />
                                    </svg>
                                }
                            >
                                {t('dashboard')}
                            </MenuLink>

                            <MenuLink
                                href={route('chat.index')}
                                active={route().current('chat.index')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V5c0-1.1.9-2 2-2h14c0 1.1.9 2 2 2v11z" />
                                    </svg>
                                }
                            >
                                {t('chat')}
                            </MenuLink>

                            <MenuLink
                                href={route('posts.index')}
                                active={route().current('posts.index')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                                    </svg>
                                }
                            >
                                {t('posts')}
                            </MenuLink>

                            <MenuLink
                                href={route('users.index')}
                                active={route().current('users.index')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                }
                            >
                                {t('users')}
                            </MenuLink>

                            <MenuLink
                                href={route('user.statistics')}
                                active={route().current('user.statistics')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                }
                            >
                                {t('statistics')}
                            </MenuLink>

                            <MenuLink
                                href={route('show_profile', { username: user.username })}
                                active={route().current('show_profile')}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            >
                                {t('YourProfile')}
                            </MenuLink>
                        </>
                    )}

                    {pages.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 px-3">
                                {t('Site pages')}
                            </h3>
                            <div className="space-y-2">
                                {pages.map((page) => (
                                    <MenuLink
                                        key={page.slug}
                                        href={`/page/${page.slug}`}
                                        active={route().current('page.show') && route().params.slug === page.slug}
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        }
                                    >
                                        {page.title}
                                    </MenuLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-80">
                {/* Top Navigation Bar */}
                <nav className="sticky top-0 z-30 flex items-center justify-between h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-6">
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page Title */}
                        {header && (
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {header}
                                </h1>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                   

                        {user ? (
                            <>
                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V9a5 5 0 00-10 0v3l-5 5h5a5 5 0 0010 0z" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl z-50 max-h-96 overflow-hidden">
                                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                                <button 
                                                    onClick={markAllAsRead} 
                                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                                >
                                                    Mark all as read
                                                </button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                        <p>{t('No notifications available')}</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notif) => {
                                                        let data;
                                                        try {
                                                            data = typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data;
                                                        } catch {
                                                            data = {};
                                                        }

                                                        return (
                                                            <div
                                                                key={notif.id}
                                                                className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                                                    !notif.read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                                                                }`}
                                                            >
                                                                <div className="flex justify-between items-start space-x-3">
                                                                    <div className="flex-1">
                                                                        <p className={`text-sm ${
                                                                            notif.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'
                                                                        }`}>
                                                                            {notif.message}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                                            {new Date(notif.created_at).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    {!notif.read && notif.type === 'follow_request' && data?.follower_id && (
                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                onClick={() => handleFollowAction(data.follower_id, 'accept', notif.id)}
                                                                                className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                                                            >
                                                                                Accept
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleFollowAction(data.follower_id, 'reject', notif.id)}
                                                                                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Profile Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-3 p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user.name}
                                            </span>
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('show_profile', { username: user.username })}>
                                            {t('YourProfile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            {t('edit_profile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {t('log_out')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    href={route('login')} 
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {t('Login')}
                                </Link>
                                <Link 
                                    href={route('register')} 
                                    className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg"
                                >
                                    {t('Register')}
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}