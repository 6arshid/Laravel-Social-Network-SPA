import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAvatarCoverForm from './Partials/UpdateAvatarCoverForm';
import Links from './Partials/Links';

const tabs = [
    { name: 'Profile Image', key: 'avatar' },
    { name: 'Links', key: 'links' },
    { name: 'Profile Info', key: 'profile' },
    { name: 'Password', key: 'password' },
    { name: 'Delete Account', key: 'delete' },
];

export default function Edit({ mustVerifyEmail, status, auth }) {
    const [activeTab, setActiveTab] = useState('avatar');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'avatar':
                return <UpdateAvatarCoverForm user={auth.user} />;
            case 'links':
                return <Links user={auth.user} />;
            case 'profile':
                return (
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                );
            case 'password':
                return <UpdatePasswordForm className="max-w-xl" />;
            case 'delete':
                return <DeleteUserForm className="max-w-xl" />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-start gap-2 sm:gap-4 border-b pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-2 px-4 text-sm font-medium rounded-t transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Animated Content */}
                    <div className="bg-white p-6 shadow sm:rounded-lg min-h-[250px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderTabContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
