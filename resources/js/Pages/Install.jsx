import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Install() {
    const { data, setData, post, processing, errors } = useForm({
        db_host: '127.0.0.1',
        db_port: '3306',
        db_database: '',
        db_username: '',
        db_password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('install.perform'));
    };

    const inputClasses = "mt-1 block w-full bg-white text-black border-gray-300 dark:bg-black dark:text-white dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500";

    return (
        <GuestLayout>
            <Head title="Install" />
            <form onSubmit={submit} className="space-y-4 text-gray-900 dark:text-white">
                <h2 className="text-xl font-semibold">Database</h2>
                <div>
                    <InputLabel htmlFor="db_host" value="DB Host" className="dark:text-white" />
                    <TextInput id="db_host" name="db_host" value={data.db_host} className={inputClasses} onChange={e => setData('db_host', e.target.value)} required />
                    <InputError message={errors.db_host} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_port" value="DB Port" className="dark:text-white" />
                    <TextInput id="db_port" name="db_port" value={data.db_port} className={inputClasses} onChange={e => setData('db_port', e.target.value)} required />
                    <InputError message={errors.db_port} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_database" value="DB Database" className="dark:text-white" />
                    <TextInput id="db_database" name="db_database" value={data.db_database} className={inputClasses} onChange={e => setData('db_database', e.target.value)} required />
                    <InputError message={errors.db_database} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_username" value="DB Username" className="dark:text-white" />
                    <TextInput id="db_username" name="db_username" value={data.db_username} className={inputClasses} onChange={e => setData('db_username', e.target.value)} required />
                    <InputError message={errors.db_username} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_password" value="DB Password" className="dark:text-white" />
                    <TextInput id="db_password" type="password" name="db_password" value={data.db_password} className={inputClasses} onChange={e => setData('db_password', e.target.value)} />
                    <InputError message={errors.db_password} className="mt-2" />
                </div>

                <PrimaryButton disabled={processing}>Install</PrimaryButton>
            </form>
        </GuestLayout>
    );
}