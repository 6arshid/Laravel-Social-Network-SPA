import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/Utils/cropImage';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function UpdateAvatarCoverForm({ page }) {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleDelete = (type) => {
        if (confirm(t('confirm_delete_image', { type: t(type) }))) {
            router.post(route('user_pages.image.delete', page.slug), { type }, { preserveScroll: true });
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setSelectedType(type);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = useCallback((e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setSelectedType(type);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const uploadCroppedImage = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        const formData = new FormData();
        formData.append('image', croppedImage);
        formData.append('type', selectedType);

        router.post(route('user_pages.upload', page.slug), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setImageSrc(null);
                setSelectedType(null);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div>
                {page?.avatar && (
                    <div className="mb-4">
                        <label className="text-sm text-gray-500">{t('current_avatar')}</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <img src={`/storage/${page.avatar}`} alt="Current Avatar" className="w-24 h-24 rounded-full object-cover border" />
                            <button onClick={() => handleDelete('avatar')} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                {t('delete_avatar')}
                            </button>
                        </div>
                    </div>
                )}
                <label className="font-semibold">{t('upload_avatar')}</label>
                <div onDrop={(e) => handleDrop(e, 'avatar')} onDragOver={preventDefaults} onDragEnter={preventDefaults} className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500">
                    <label className="w-full h-full cursor-pointer">
                        <p className="text-gray-500 text-sm">{t('drag_drop_avatar')}</p>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'avatar')} />
                    </label>
                </div>
            </div>
            <div>
                {page?.cover && (
                    <div className="mb-4">
                        <label className="text-sm text-gray-500">{t('current_cover')}</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <img src={`/storage/${page.cover}`} alt="Current Cover" className="w-full h-32 object-cover rounded border" />
                            <button onClick={() => handleDelete('cover')} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                {t('delete_cover')}
                            </button>
                        </div>
                    </div>
                )}
                <label className="font-semibold">{t('upload_cover')}</label>
                <div onDrop={(e) => handleDrop(e, 'cover')} onDragOver={preventDefaults} onDragEnter={preventDefaults} className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500">
                    <label className="w-full h-full cursor-pointer">
                        <p className="text-gray-500 text-sm">{t('drag_drop_cover')}</p>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} />
                    </label>
                </div>
            </div>
            {imageSrc && (
                <div className="relative w-full h-80 bg-gray-100 border mt-4 rounded overflow-hidden">
                    <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={selectedType === 'avatar' ? 1 : 851 / 315} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                </div>
            )}
            {imageSrc && (
                <div className="flex justify-between items-center mt-4">
                    <button onClick={uploadCroppedImage} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        {t('save_image')}
                    </button>
                    <button onClick={() => { setImageSrc(null); setSelectedType(null); }} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                        {t('cancel')}
                    </button>
                </div>
            )}
        </div>
    );
}
