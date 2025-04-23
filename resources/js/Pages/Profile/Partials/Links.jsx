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
    

    const [usernameStatus, setUsernameStatus] = useState(null); // true = available, false = taken, null = unknown
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
                        // don't show backend error unless submitting
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
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
            {[
    ['bio', 'Bio'],
    ['location', 'Location'],
    ['website', 'Website'],
    ['phone', 'Phone'],
    ['instagram', 'Instagram'],
    ['twitter', 'Twitter'],
    ['facebook', 'Facebook'],
    ['linkedin', 'LinkedIn'],
    ['github', 'GitHub'],
    ['tiktok', 'TikTok'],
    ['snapchat', 'Snapchat'],
    ['youtube', 'YouTube'],
    ['pinterest', 'Pinterest'],
    ['whatsapp', 'WhatsApp'],
    ['telegram', 'Telegram'],
].map(([key, label]) => (
    <div key={key}>
        <InputLabel htmlFor={key} value={label} />
        <TextInput
            id={key}
            className="mt-1 block w-full"
            value={data[key]}
            onChange={(e) => setData(key, e.target.value)}
            autoComplete={key}
        />
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
