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
import { useTranslation } from 'react-i18next';

export default function Edit({ mustVerifyEmail, status, auth, blockedUsers }) {
    const [activeTab, setActiveTab] = useState('profile');
    const { t } = useTranslation();

    const tabs = [
        { name: t('profile_info'), key: 'profile' },
        { name: t('profile_image'), key: 'avatar' },
        { name: t('links'), key: 'links' },
        { name: t('password'), key: 'password' },
        { name: t('notifications'), key: 'notifications' },
        { name: t('blocked_users'), key: 'blocks' },
        { name: t('delete_account'), key: 'delete' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                );
            case 'avatar':
                return <UpdateAvatarCoverForm user={auth.user} />;
            case 'links':
                return <Links user={auth.user} />;
            case 'password':
                return <UpdatePasswordForm className="max-w-xl" />;
            case 'notifications':
                return <NotificationSettingsForm user={auth.user} />;
            case 'blocks':
                return <BlockedUsers blockedUsers={blockedUsers} />;
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
                    {t('edit_profile')}
                </h2>
            }
        >
            <Head title={t('profile')} />

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
