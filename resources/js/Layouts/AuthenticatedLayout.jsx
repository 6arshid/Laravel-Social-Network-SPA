import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-white border-r border-gray-200 z-50 sm:relative sm:flex sm:flex-col`}>
                <div className="flex items-center justify-center h-16 border-b">
                    <Link href="/">
                        <ApplicationLogo className="h-10 w-auto" />
                    </Link>
                </div>
                <div className="p-4 flex flex-col space-y-2">
                    {user && (
                        <>
                            {user.is_admin === 1 && (
                                <NavLink href="/admin/panel" active={route().current('admin.panel')}>Admin Panel</NavLink>
                            )}
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</NavLink>
                            <NavLink href={route('chat.index')} active={route().current('chat.index')}>Chat</NavLink>
                            <NavLink href={route('posts.index')} active={route().current('posts.index')}>Posts</NavLink>
                            <NavLink href={route('users.index')} active={route().current('users.index')}>Users</NavLink>
                            <NavLink href={route('user.statistics')} active={route().current('user.statistics')}>Statistics</NavLink>
                            <NavLink href={route('show_profile', { username: user.username })} active={route().current('show_profile')}>Show Your Profile</NavLink>
                        </>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <nav className="flex items-center justify-between h-16 bg-white border-b px-4">
                    <div className="flex items-center">
                        <button className="sm:hidden text-gray-500 focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        {user && (
                            <div className="relative">
                                <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-2xl">
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
                                            <div className="p-4 text-sm text-gray-500 text-center">No notifications available</div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <Link
                                                    key={notif.id}
                                                    href={notif.link || '#'}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={`block px-4 py-2 text-sm border-b ${notif.read ? 'text-gray-500' : 'font-bold text-black'} hover:bg-gray-100`}
                                                >
                                                    {notif.message}
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile dropdown */}
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
                                    <Dropdown.Link href={route('profile.edit')}>Edit Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        )}
                    </div>
                </nav>

                {/* Main */}
                <main className="flex-1 p-6 bg-gray-100">
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