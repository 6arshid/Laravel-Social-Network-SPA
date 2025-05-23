import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function NotificationSettingsForm({ user }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        disable_notifications: user.disable_notifications,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.notifications'));
    };

    return (
        <form onSubmit={submit} className="space-y-6 max-w-xl">
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={data.disable_notifications}
                    onChange={(e) => setData('disable_notifications', e.target.checked)}
                />
                <span>{t('disable_email_notifications')}</span>
            </label>

            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={processing}
            >
                {t('save')}
            </button>

            {recentlySuccessful && <p className="text-green-600">{t('saved')}</p>}
        </form>
    );
}
