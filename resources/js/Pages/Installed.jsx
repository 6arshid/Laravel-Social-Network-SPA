import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';

export default function Installed() {
    const { post, processing } = useForm({});

    const removeFile = (e) => {
        e.preventDefault();
        post(route('install.delete-file'));
    };

    return (
        <GuestLayout>
            <Head title="Installed" />
            <div className="text-center py-10 text-white">
                <h1 className="text-2xl font-bold mb-4">Installation Complete</h1>
                <p className="mb-2">Admin email: <strong>admin@admin.com</strong></p>
                <p>Admin password: <strong>admin@admin.com</strong></p>
                <p className="mb-6">Please change <strong>your email and password</strong> after logging in.</p>
                <form onSubmit={removeFile} className="mt-6">
                    <PrimaryButton disabled={processing}>Delete install file</PrimaryButton>
                </form>
            </div>
        </GuestLayout>
    );
}
