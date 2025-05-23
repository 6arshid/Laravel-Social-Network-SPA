import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head , Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayoutAdmin
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            
new code
    
    
                            
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
