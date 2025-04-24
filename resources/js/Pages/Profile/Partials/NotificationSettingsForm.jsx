import { useForm } from '@inertiajs/react';

export default function NotificationSettingsForm({ user }) {
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
                <span>Disable email notifications</span>
            </label>

            <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={processing}
            >
                Save
            </button>

            {recentlySuccessful && <p className="text-green-600">Saved!</p>}
        </form>
    );
}
