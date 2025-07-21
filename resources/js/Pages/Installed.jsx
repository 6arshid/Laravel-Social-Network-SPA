import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';

export default function Installed() {
    return (
        <GuestLayout>
            <Head title="Installed" />
            <div className="text-center py-10 text-white">
                <h1 className="text-2xl font-bold mb-4">Installation Complete</h1>
                <p>Admin username and password: <strong>admin@admin.com</strong></p>
            </div>
        </GuestLayout>
    );
}
