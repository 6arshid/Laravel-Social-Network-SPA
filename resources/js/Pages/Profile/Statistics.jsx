import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatisticsChart from '@/Components/StatisticsChart';

export default function Dashboard({ daily, monthly, yearly, total }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Statistics
                </h2>
            }
        >
            <Head title="Statistics" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <StatisticsChart daily={daily} monthly={monthly} yearly={yearly} total={total} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
