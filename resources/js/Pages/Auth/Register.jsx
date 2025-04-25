import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

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
                    <InputLabel htmlFor="email" value="Email" />

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
                    <InputLabel htmlFor="password" value="Password" />

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
                        value="Confirm Password"
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
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
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
      fill="#4285F4"
      d="M533.5 278.4c0-17.4-1.4-34-4-50.1H272v95.1h147.3c-6.4 34-25.1 62.7-53.6 81.9v68.2h86.8c50.8-46.8 80-115.7 80-195.1z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c72.6 0 133.6-24.1 178.1-65.4l-86.8-68.2c-24.1 16.1-55 25.7-91.3 25.7-70.2 0-129.6-47.4-150.8-111.1H33.5v69.8c44.6 88.3 136.4 149.2 238.5 149.2z"
    />
    <path
      fill="#FBBC04"
      d="M121.2 325.3c-10-29.7-10-61.5 0-91.2v-69.8H33.5c-30.4 60.8-30.4 132.2 0 193z"
    />
    <path
      fill="#EA4335"
      d="M272 107.7c39.5-.6 77.3 13.5 106.5 39.9l79.3-79.3C412.5 24.5 343.9-.3 272 0 169.9 0 78.1 60.9 33.5 149.2l87.7 69.8C142.4 155.1 201.8 107.7 272 107.7z"
    />
  </svg>
  <span className="font-medium">Connect with Google</span>
</a>

        </GuestLayout>
    );
}
