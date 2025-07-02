import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAvatarCoverForm from './Partials/UpdateAvatarCoverForm';
import Links from './Partials/Links';
import NotificationSettingsForm from './Partials/NotificationSettingsForm';
import BlockedUsers from './Partials/BlockedUsers';

export default function Edit({ mustVerifyEmail, status, auth, blockedUsers }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const tabs = [
        { 
            name: 'Profile Information', 
            key: 'profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        { 
            name: 'Avatar & Cover', 
            key: 'avatar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        { 
            name: 'Social Links', 
            key: 'links',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )
        },
        { 
            name: 'Security', 
            key: 'password',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )
        },
        { 
            name: 'Notifications', 
            key: 'notifications',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-10 5a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
            )
        },
        { 
            name: 'Blocked Users', 
            key: 'blocks',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
            )
        },
        { 
            name: 'Delete Account', 
            key: 'delete',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-4xl"
                    />
                );
            case 'avatar':
                return <UpdateAvatarCoverForm user={auth.user} />;
            case 'links':
                return <Links user={auth.user} />;
            case 'password':
                return <UpdatePasswordForm className="max-w-4xl" />;
            case 'notifications':
                return <NotificationSettingsForm user={auth.user} />;
            case 'blocks':
                return <BlockedUsers blockedUsers={blockedUsers} />;
            case 'delete':
                return <DeleteUserForm className="max-w-4xl" />;
            default:
                return null;
        }
    };

    const getTabDescription = (key) => {
        const descriptions = {
            profile: 'Manage your basic account information and preferences',
            avatar: 'Upload and customize your profile picture and cover photo',
            links: 'Add your social media profiles and website links',
            password: 'Update your password and security settings',
            notifications: 'Configure how you receive notifications',
            blocks: 'Manage users you have blocked',
            delete: 'Permanently delete your account and all data'
        };
        return descriptions[key];
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
                                Account Settings
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                Manage your account settings and preferences
                            </p>
                        </div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                }
            >
                <Head title="Profile Settings" />

                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                
                                {/* Sidebar Navigation */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Settings Menu
                                            </h3>
                                        </div>
                                        <nav className="space-y-1 p-2">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setActiveTab(tab.key)}
                                                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                                                        activeTab === tab.key
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                    }`}
                                                >
                                                    <span className={`${
                                                        activeTab === tab.key 
                                                            ? 'text-blue-600 dark:text-blue-400' 
                                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                                    }`}>
                                                        {tab.icon}
                                                    </span>
                                                    <span className="font-medium text-sm">
                                                        {tab.name}
                                                    </span>
                                                    {tab.key === 'delete' && (
                                                        <span className="ml-auto">
                                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* User Quick Info */}
                                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-lg">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {auth.user.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {auth.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="lg:col-span-3">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                        
                                        {/* Content Header */}
                                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-blue-600 dark:text-blue-400">
                                                    {tabs.find(tab => tab.key === activeTab)?.icon}
                                                </span>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                        {tabs.find(tab => tab.key === activeTab)?.name}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        {getTabDescription(activeTab)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Animated Content */}
                                        <div className="p-6 min-h-[400px]">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={activeTab}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ 
                                                        duration: 0.3, 
                                                        ease: [0.4, 0.0, 0.2, 1] 
                                                    }}
                                                    className="h-full"
                                                >
                                                    {renderTabContent()}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Status Messages */}
                                    {status && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                                    {status}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}