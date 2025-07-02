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
        admin_name: '',
        admin_email: '',
        admin_username: '',
        admin_password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('install.perform'));
    };

    return (
        <GuestLayout>
            <Head title="Install" />
            <form onSubmit={submit} className="space-y-4">
                <h2 className="text-xl font-semibold">Database</h2>
                <div>
                    <InputLabel htmlFor="db_host" value="DB Host" />
                    <TextInput id="db_host" name="db_host" value={data.db_host} className="mt-1 block w-full" onChange={e => setData('db_host', e.target.value)} required />
                    <InputError message={errors.db_host} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_port" value="DB Port" />
                    <TextInput id="db_port" name="db_port" value={data.db_port} className="mt-1 block w-full" onChange={e => setData('db_port', e.target.value)} required />
                    <InputError message={errors.db_port} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_database" value="DB Database" />
                    <TextInput id="db_database" name="db_database" value={data.db_database} className="mt-1 block w-full" onChange={e => setData('db_database', e.target.value)} required />
                    <InputError message={errors.db_database} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_username" value="DB Username" />
                    <TextInput id="db_username" name="db_username" value={data.db_username} className="mt-1 block w-full" onChange={e => setData('db_username', e.target.value)} required />
                    <InputError message={errors.db_username} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="db_password" value="DB Password" />
                    <TextInput id="db_password" type="password" name="db_password" value={data.db_password} className="mt-1 block w-full" onChange={e => setData('db_password', e.target.value)} />
                    <InputError message={errors.db_password} className="mt-2" />
                </div>

                <h2 className="text-xl font-semibold pt-4">Admin User</h2>
                <div>
                    <InputLabel htmlFor="admin_name" value="Name" />
                    <TextInput id="admin_name" name="admin_name" value={data.admin_name} className="mt-1 block w-full" onChange={e => setData('admin_name', e.target.value)} required />
                    <InputError message={errors.admin_name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="admin_email" value="Email" />
                    <TextInput id="admin_email" type="email" name="admin_email" value={data.admin_email} className="mt-1 block w-full" onChange={e => setData('admin_email', e.target.value)} required />
                    <InputError message={errors.admin_email} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="admin_username" value="Username" />
                    <TextInput id="admin_username" name="admin_username" value={data.admin_username} className="mt-1 block w-full" onChange={e => setData('admin_username', e.target.value)} required />
                    <InputError message={errors.admin_username} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="admin_password" value="Password" />
                    <TextInput id="admin_password" type="password" name="admin_password" value={data.admin_password} className="mt-1 block w-full" onChange={e => setData('admin_password', e.target.value)} required />
                    <InputError message={errors.admin_password} className="mt-2" />
                </div>
                <PrimaryButton disabled={processing}>Install</PrimaryButton>
            </form>
        </GuestLayout>
    );
}
