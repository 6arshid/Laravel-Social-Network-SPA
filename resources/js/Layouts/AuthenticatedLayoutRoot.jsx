import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user.is_admin === 1 && (
                                    <NavLink href="/admin/panel" active={route().current('admin.panel')}>
                                        Admin Panel
                                    </NavLink>
                                )}
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('chat.index')} active={route().current('chat.index')}>
                                    Chat
                                </NavLink>
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    Posts
                                </NavLink>
                                <NavLink href={route('users.index')} active={route().current('users.index')}>
                                    Users
                                </NavLink>
                                <NavLink href={route('show_profile', user.username)} active={route().current('show_profile')}>
                                    Show Your Profile
                                </NavLink>
                            </div>
                        </div>

                        {/* Desktop - Search Form */}
                        <div className="hidden sm:flex sm:items-center space-x-4">
                            <form action="/root_search" method="GET" className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Search..."
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Mobile - Menu Toggle Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile - Dropdown Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {user.is_admin === 1 && (
                            <ResponsiveNavLink href="/admin/panel" active={route().current('admin.panel')}>
                                Admin Panel
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('chat.index')} active={route().current('chat.index')}>Chat</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('posts.index')} active={route().current('posts.index')}>Posts</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('show_profile', user.username)} active={route().current('show_profile')}>Show Your Profile</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        {/* Mobile - Search Form */}
                        <div className="mt-3 space-y-1 px-4">
                            <form action="/root_search" method="GET" className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Search..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    Go
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
