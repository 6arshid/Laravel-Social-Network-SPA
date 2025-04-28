import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import StatisticsChart from '@/Components/StatisticsChart';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ daily, monthly, yearly, total }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {t('statistics')}
                </h2>
            }
        >
            <Head title={t('statistics')} />

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
