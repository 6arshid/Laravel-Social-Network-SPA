import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayoutAdmin from '@/Layouts/AuthenticatedLayoutAdmin';
import { Head } from '@inertiajs/react';

export default function Create({ auth, flash, reservedUsernames }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('reserved-usernames.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayoutAdmin user={auth.user}>
            <Head title="Reserved Usernames" />

            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold mb-4">Reserve a Username</h1>

                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="mb-8">
                    <div className="mb-4">
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoFocus
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    <PrimaryButton disabled={processing}>Reserve</PrimaryButton>
                </form>

                <h2 className="text-xl font-semibold mb-2">Reserved Usernames</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-300 text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Username</th>
                                <th className="px-4 py-2 border">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservedUsernames.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                                        No reserved usernames yet.
                                    </td>
                                </tr>
                            ) : (
                                reservedUsernames.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 border">{item.id}</td>
                                        <td className="px-4 py-2 border">{item.username}</td>
                                        <td className="px-4 py-2 border">{item.created_at}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}
