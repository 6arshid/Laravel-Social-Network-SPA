import axios from 'axios';

export default function LanguageList({ languages, onDelete, onEditTranslations }) {
    const handleDelete = async (lang) => {
        if (!confirm(`Are you sure you want to delete "${lang.name}"?`)) return;
        try {
            await axios.delete(`/admin/languages/${lang.id}`);
            onDelete(lang);
            alert('Language deleted successfully.');
        } catch (err) {
            console.error('Error deleting language:', err);
            alert('Error deleting language.');
        }
    };

    return (
        <div>
            <h3 className="font-semibold mb-2">Languages List</h3>
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-2">#</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Code</th>
                        <th className="text-left p-2">Direction</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {languages.map((lang, index) => (
                        <tr key={lang.id} className="border-b">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{lang.name}</td>
                            <td className="p-2">{lang.code}</td>
                            <td className="p-2">{lang.direction}</td>
                            <td className="p-2 text-center">
                                <button onClick={() => onEditTranslations(lang)}
                                        className="text-sm text-blue-600 mr-2">Edit Translations</button>
                                <button onClick={() => handleDelete(lang)}
                                        className="text-sm text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
