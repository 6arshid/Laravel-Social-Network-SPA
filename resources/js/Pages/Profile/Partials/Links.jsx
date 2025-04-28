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
        bio: user.bio ?? '',
        location: user.location ?? '',
        website: user.website ?? '',
        phone: user.phone ?? '',
        instagram: user.instagram ?? '',
        twitter: user.twitter ?? '',
        facebook: user.facebook ?? '',
        linkedin: user.linkedin ?? '',
        github: user.github ?? '',
        tiktok: user.tiktok ?? '',
        snapchat: user.snapchat ?? '',
        youtube: user.youtube ?? '',
        pinterest: user.pinterest ?? '',
        whatsapp: user.whatsapp ?? '',
        telegram: user.telegram ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">{t('profile_links_information')}</h2>
                <p className="mt-1 text-sm text-gray-600">
                    {t('update_social_network_info')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="bio" value={t('bio')} />
                    <textarea
                        id="bio"
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows="4"
                    ></textarea>
                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {[
                    ['location', 'location', ''],
                    ['website', 'website', 'https://'],
                    ['phone', 'phone', ''],
                    ['instagram', 'instagram', 'https://instagram.com/'],
                    ['twitter', 'twitter', 'https://twitter.com/'],
                    ['facebook', 'facebook', 'https://facebook.com/'],
                    ['linkedin', 'linkedin', 'https://linkedin.com/in/'],
                    ['github', 'github', 'https://github.com/'],
                    ['tiktok', 'tiktok', 'https://tiktok.com/@'],
                    ['snapchat', 'snapchat', 'https://snapchat.com/add/'],
                    ['youtube', 'youtube', 'https://youtube.com/@'],
                    ['pinterest', 'pinterest', 'https://pinterest.com/'],
                    ['whatsapp', 'whatsapp', 'https://wa.me/'],
                    ['telegram', 'telegram', 'https://t.me/'],
                ].map(([key, label, base]) => (
                    <div key={key}>
                        <InputLabel htmlFor={key} value={t(label)} />
                        <div className="flex items-center gap-2">
                            {base && (
                                <span className="text-sm text-gray-500">{base}</span>
                            )}
                            <TextInput
                                id={key}
                                className="mt-1 block w-full"
                                value={data[key]}
                                onChange={(e) => setData(key, e.target.value)}
                                autoComplete={key}
                            />
                        </div>
                        <InputError className="mt-2" message={errors[key]} />
                    </div>
                ))}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('save')}</PrimaryButton>

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
