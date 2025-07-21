import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const { t } = useTranslation();

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('register')} />

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="name"
                        value={t('name')}
                        className="text-white"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="email"
                        value={t('email')}
                        className="text-white"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value={t('password')}
                        className="text-white"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t('confirm_password')}
                        className="text-white"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t('already_registered')}
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {t('register')}
                    </PrimaryButton>
                </div>
            </form>

            <a
                href="/auth/google/redirect"
                className="mt-5 flex items-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-gray-100"
            >
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 533.5 544.3"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M533.5 278.4c0-17.7-1.3-35.5-4-52.7H272v99.9h146.9c-6.3 33.8-25 62.3-53.2 81.5v67h85.9c50.2-46.2 78.9-114.3 78.9-195.7z"
                        fill="#4285F4"
                    />
                    <path
                        d="M272 544.3c72.5 0 133.6-23.9 178.1-64.7l-85.9-67c-23.7 16-54 24.7-92.2 24.7-70.8 0-130.7-47.7-152.1-111.4H33.9v69.9c44.6 86.7 135.8 148.5 238.1 148.5z"
                        fill="#34A853"
                    />
                    <path
                        d="M119.9 325.9c-10.6-31.9-10.6-66.8 0-98.7V157.3H33.9c-35.6 69.3-35.6 151.1 0 220.4l86-51.8z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M272 107.7c39.4-.6 77 13.8 105.8 39.7l79-79C417 30.3 345.1 0 272 0 167.8 0 76.6 61.8 33.9 148.5l86 69.9c21.4-63.7 81.3-111.4 152.1-111.4z"
                        fill="#EA4335"
                    />
                </svg>
                <span className="font-medium">{t('connect_with_google')}</span>
            </a>

        </GuestLayout>
    );
}
