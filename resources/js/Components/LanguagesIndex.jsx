import { useState } from 'react';
import AddLanguageForm from '@/Components/AddLanguageForm';
import LanguageList from '@/Components/LanguageList';
import axios from 'axios';

export default function LanguagesIndex({ languages: initialLanguages }) {
    const [languages, setLanguages] = useState(initialLanguages);
    const [selectedLang, setSelectedLang] = useState(null);
    const [translations, setTranslations] = useState({});

    const handleLanguageAdded = (newLang) => {
        setLanguages([...languages, newLang]);
    };

    const handleLanguageDeleted = (lang) => {
        setLanguages(languages.filter(l => l.id !== lang.id));
        if (selectedLang && selectedLang.id === lang.id) {
            setSelectedLang(null);
            setTranslations({});
        }
    };

    const handleEditTranslations = async (lang) => {
        setSelectedLang(lang);
        try {
            const res = await axios.get(`/get-translations/${lang.code}`);
            setTranslations(res.data);
        } catch (err) {
            console.error('Error fetching translations:', err);
        }
    };

    const handleTranslationChange = (key, value) => {
        setTranslations(prev => ({ ...prev, [key]: value }));
    };
    const handleSaveTranslations = async () => {
        if (!selectedLang) return;
        try {
            const res = await axios.post(`/admin/update-translations/${selectedLang.code}`, translations); // 🔥 اینجا هم /admin اضافه شد
            console.log('Save response:', res.data);
            alert('Translations saved successfully.');
        } catch (err) {
            console.error('Error saving translations:', err.response?.data || err.message);
            // alert('Error saving translations.');
        }
    };

    return (
        <div className="p-6">

            <AddLanguageForm onLanguageAdded={handleLanguageAdded} />

            <LanguageList 
                languages={languages} 
                onDelete={handleLanguageDeleted} 
                onEditTranslations={handleEditTranslations}
            />

            {selectedLang && (
                <div className="mt-6 p-4 border rounded">
                    <h3 className="font-semibold mb-3">
                        Edit translations for: {selectedLang.name} ({selectedLang.code})
                    </h3>
                    {Object.keys(translations).length === 0 ? (
                        <p>Loading translations...</p>
                    ) : (
                        <div className="mb-4">
                            {Object.entries(translations).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                    <label className="block text-sm font-medium mb-1">{key}:</label>
                                    <input type="text" value={value}
                                           onChange={e => handleTranslationChange(key, e.target.value)}
                                           className="border rounded p-1 w-full" />
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={handleSaveTranslations} className="bg-green-600 text-white px-4 py-2 rounded">
                        Save Translations
                    </button>
                    <button onClick={() => { setSelectedLang(null); setTranslations({}); }}
                            className="ml-2 px-4 py-2 rounded border">
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}