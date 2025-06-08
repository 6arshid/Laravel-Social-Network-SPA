import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function BlockedUsers({ blockedUsers }) {
    const { t } = useTranslation();
    const [users, setUsers] = useState(blockedUsers);

    const handleUnblock = (username) => {
        axios.delete(route('user.unblock', username)).then(() => {
            setUsers(users.filter((u) => u.username !== username));
        });
    };

    if (!users.length) {
        return <p className="text-sm text-gray-600">{t('no_blocked_users')}</p>;
    }

    return (
        <div className="space-y-4">
            {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-4">
                        <img src={u.avatar ? `/storage/${u.avatar}` : '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-sm text-gray-500">@{u.username}</p>
                        </div>
                    </div>
                    <button onClick={() => handleUnblock(u.username)} className="px-3 py-1 text-xs bg-red-500 text-white rounded">
                        {t('unblock')}
                    </button>
                </div>
            ))}
        </div>
    );
}
