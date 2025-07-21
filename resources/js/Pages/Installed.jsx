import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Installed() {

    return (
        <GuestLayout>
            <Head title="Installed" />
            <div className="text-center py-10 text-white">
                <h1 className="text-2xl font-bold mb-4">Installation Complete</h1>
                <p className="mb-2">Admin email: <strong>admin@admin.com</strong></p>
                <p>Admin password: <strong>admin@admin.com</strong></p>
                <p className="mb-6">Please change <strong>your email and password</strong> after logging in.</p>
                <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Show your website
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
