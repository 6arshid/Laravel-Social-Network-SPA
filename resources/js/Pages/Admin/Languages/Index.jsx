import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head , Link } from '@inertiajs/react';
import LanguagesIndex from '@/Components/LanguagesIndex';

export default function Dashboard({ languages }) {
    return (
        <AuthenticatedLayoutAdmin
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Languages and Translations Management
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <LanguagesIndex languages={languages} />
                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
