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
    const { t } = useTranslation();

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

    const MenuLink = ({ href, active, icon, children }) => (
        <Link
            href={href}
            className={`flex items-center p-2 rounded-md space-x-2 hover:bg-gray-100 hover:text-blue-600 ${
                active ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }`}
        >
            {icon}
            <span>{children}</span>
        </Link>
    );

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 overflow-y-auto transform transition-transform duration-200 ease-in-out 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
            >
                <div className="flex items-center justify-between h-16 border-b px-4">
                    <Link href="/">
                        <ApplicationLogo className="h-10 w-auto" />
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        className="sm:hidden text-gray-600 focus:outline-none"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-4 flex flex-col space-y-2">
                {user && (
                        <>
                            {user.is_admin === 1 && (
                                <MenuLink
                                    href="/admin/panel"
                                    active={route().current('admin.panel')}
                                    icon={
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 7h18M3 12h18M3 17h18"
                                            />
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
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2 4 4 8-8 2 2"
                                        />
                                    </svg>
                                }
                            >
                                {t('dashboard')}
                            </MenuLink>

                            <MenuLink
                                href={route('chat.index')}
                                active={route().current('chat.index')}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 10h.01M12 10h.01M16 10h.01M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z"
                                        />
                                    </svg>
                                }
                            >
                                {t('chat')}
                            </MenuLink>

                            <MenuLink
                                href={route('posts.index')}
                                active={route().current('posts.index')}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 11H5m14 0a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm0 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
                                        />
                                    </svg>
                                }
                            >
                                 {t('posts')}
                            </MenuLink>

                            <MenuLink
                                href={route('users.index')}
                                active={route().current('users.index')}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87M9 4a4 4 0 110 8 4 4 0 010-8zm6 0a4 4 0 110 8 4 4 0 010-8z"
                                        />
                                    </svg>
                                }
                            >
                                 {t('users')}
                            </MenuLink>

                            <MenuLink
                                href={route('user.statistics')}
                                active={route().current('user.statistics')}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 17l-5-5m0 0l5-5m-5 5h12"
                                        />
                                    </svg>
                                }
                            >
                                 {t('statistics')}
                            </MenuLink>

                            <MenuLink
                                href={route('show_profile', { username: user.username })}
                                active={route().current('show_profile')}
                                icon={
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5.121 17.804A9 9 0 1118.88 6.197a9 9 0 01-13.758 11.607z"
                                        />
                                    </svg>
                                }
                            >
                                {t('YourProfile')}
                            </MenuLink>
                        </>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col" style={{ marginLeft: '0' }}>
                {/* Top Navigation Bar */}
                <nav className="flex items-center justify-between h-16 bg-white border-b px-4">
                    <div className="flex items-center">
                        {/* Hamburger Menu */}
                        <button
                            className="sm:hidden text-gray-500 focus:outline-none"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                           {/* Notifications */}
                                             {user && (
                                                 <div className="relative">
                                                     <button
                                                         onClick={() => setShowNotifications(!showNotifications)}
                                                         className="relative text-2xl"
                                                     >
                                                         <span className="text-gray-700">🔔</span>
                                                         {unreadCount > 0 && (
                                                             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                                 {unreadCount}
                                                             </span>
                                                         )}
                                                     </button>
                     
                                                     {showNotifications && (
                                                         <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
                                                             {notifications.length === 0 ? (
                                                                 <div className="p-4 text-sm text-gray-500 text-center"> {t('No notifications available')}</div>
                                                             ) : (
                                                                 notifications.map((notif) => (
                                                                     <Link
                                                                         key={notif.id}
                                                                         href={notif.link || '#'}
                                                                         onClick={() => markAsRead(notif.id)}
                                                                         className={`block px-4 py-2 text-sm border-b ${
                                                                             notif.read ? 'text-gray-500' : 'font-bold text-black'
                                                                         } hover:bg-gray-100`}
                                                                     >
                                                                         {notif.message}
                                                                     </Link>
                                                                 ))
                                                             )}
                                                         </div>
                                                     )}
                                                 </div>
                                             )}
                     
                                             {/* Profile Dropdown */}
                                             {user && (
                                                 <Dropdown>
                                                     <Dropdown.Trigger>
                                                         <span className="inline-flex rounded-md">
                                                             <button
                                                                 type="button"
                                                                 className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                                             >
                                                                 {user.name}
                                                                 <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                 </svg>
                                                             </button>
                                                         </span>
                                                     </Dropdown.Trigger>
                                                     <Dropdown.Content>
                                                         <Dropdown.Link href={route('profile.edit')}>{t('Edit Profile')}</Dropdown.Link>
                                                         <Dropdown.Link href={route('logout')} method="post" as="button">
                                                         {t('log_out')}
                                                         </Dropdown.Link>
                                                     </Dropdown.Content>
                                                 </Dropdown>
                                             )}
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-100 overflow-y-auto sm:ml-64">
                    {header && (
                        <div className="mb-4">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
