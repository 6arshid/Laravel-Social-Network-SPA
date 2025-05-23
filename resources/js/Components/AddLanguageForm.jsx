import { useState } from 'react';
import axios from 'axios';

export default function AddLanguageForm({ onLanguageAdded }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [direction, setDirection] = useState('LTR');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await axios.post('/admin/languages', { name, code, direction }); // Changed here
            onLanguageAdded(response.data);
            setName('');
            setCode('');
            setDirection('LTR');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error adding new language.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Add New Language</h3>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Language Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                       className="border rounded p-1 w-full" required />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Language Code:</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value)}
                       className="border rounded p-1 w-full" required maxLength={5} />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Text Direction:</label>
                <select value={direction} onChange={e => setDirection(e.target.value)}
                        className="border rounded p-1 w-full">
                    <option value="LTR">Left-to-Right (LTR)</option>
                    <option value="RTL">Right-to-Left (RTL)</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Language</button>
        </form>
    );
}