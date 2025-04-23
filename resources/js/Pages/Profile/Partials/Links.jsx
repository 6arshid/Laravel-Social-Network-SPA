import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
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

    const [usernameStatus, setUsernameStatus] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);


    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Links Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your social network information.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="bio" value="Bio" />
                    <textarea
                        id="bio"
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        rows="4"
                    ></textarea>
                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {[ // link fields with base URLs
                    ['location', 'Location', ''],
                    ['website', 'Website', 'https://'],
                    ['phone', 'Phone', ''],
                    ['instagram', 'Instagram', 'https://instagram.com/'],
                    ['twitter', 'Twitter', 'https://twitter.com/'],
                    ['facebook', 'Facebook', 'https://facebook.com/'],
                    ['linkedin', 'LinkedIn', 'https://linkedin.com/in/'],
                    ['github', 'GitHub', 'https://github.com/'],
                    ['tiktok', 'TikTok', 'https://tiktok.com/@'],
                    ['snapchat', 'Snapchat', 'https://snapchat.com/add/'],
                    ['youtube', 'YouTube', 'https://youtube.com/@'],
                    ['pinterest', 'Pinterest', 'https://pinterest.com/'],
                    ['whatsapp', 'WhatsApp', 'https://wa.me/'],
                    ['telegram', 'Telegram', 'https://t.me/'],
                ].map(([key, label, base]) => (
                    <div key={key}>
                        <InputLabel htmlFor={key} value={label} />
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
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}