import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful, clearErrors } = useForm({
        name: user.name,
        email: user.email,
        username: user.username ?? '',
        is_private: user.is_private ?? false, 

    });

    const [usernameStatus, setUsernameStatus] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    useEffect(() => {
        if (data.username.length < 4) {
            setUsernameStatus(null);
            return;
        }

        const delayDebounce = setTimeout(() => {
            setCheckingUsername(true);
            axios.post(route('username.check'), { username: data.username })
                .then((res) => {
                    setUsernameStatus(res.data.available);
                    if (!res.data.available) {
                        clearErrors('username');
                    }
                })
                .catch(() => setUsernameStatus(null))
                .finally(() => setCheckingUsername(false));
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [data.username]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {t('profile_information')}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    {t('update_profile_info')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value={t('name')} />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="username" value={t('username')} />
                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.username} />

                    {data.username.length >= 4 && (
                        <div className="mt-1 text-sm">
                            {checkingUsername ? (
                                <span className="text-gray-500">{t('checking_username')}</span>
                            ) : usernameStatus === true ? (
                                <span className="text-green-600">{t('username_available')}</span>
                            ) : usernameStatus === false ? (
                                <span className="text-red-600">{t('username_not_available')}</span>
                            ) : null}
                        </div>
                    )}
                </div>
<div>
    <InputLabel htmlFor="is_private" value={t('private_profile')} />
    <label className="flex items-center mt-2">
        <input
            id="is_private"
            type="checkbox"
            checked={data.is_private}
            onChange={(e) => setData('is_private', e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
        />
        <span className="ml-2 text-sm text-gray-600">{t('make_profile_private')}</span>
    </label>
    <InputError className="mt-2" message={errors.is_private} />
</div>
                <div>
                    <InputLabel htmlFor="email" value={t('email')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            {t('email_unverified')}{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                {t('resend_verification')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                {t('verification_sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {t('save')}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">{t('saved')}</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
