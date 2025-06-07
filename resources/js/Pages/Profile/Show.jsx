import React, { useState, useCallback } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Cropper from 'react-easy-crop';
import PostCard from '@/Components/PostCard';
import SocialLinks from '@/Components/SocialLinks';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

dayjs.extend(relativeTime);
dayjs.locale('en');

function createImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (err) => reject(err);
        image.crossOrigin = 'anonymous';
        image.src = url;
    });
}

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}

export default function Show() {
    const { auth, user, posts, isOwner, isFollowing, isBlocked, appName, captcha } = usePage().props;
    const { t } = useTranslation();
    const loggedInUser = auth?.user;
    const [allPosts, setAllPosts] = useState(posts.data);
    const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [following, setFollowing] = useState(isFollowing);
    const [blocked, setBlocked] = useState(isBlocked);
    const [isUploading, setIsUploading] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return null;
        return `/storage/${path}?v=${new Date().getTime()}`;
    };

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setSelectedType(type);
        };
        reader.readAsDataURL(file);
    };

    const uploadCroppedImage = async () => {
        setIsUploading(true);
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        const formData = new FormData();
        formData.append('image', croppedImage);
        formData.append('type', selectedType);

        Inertia.post(route('profile.upload'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setImageSrc(null);
                setSelectedType(null);
                setIsUploading(false);
                Inertia.reload({ only: ['user'] });
            },
            onError: () => {
                setIsUploading(false);
            },
        });
    };

    const deleteImage = (type) => {
        if (!confirm('Delete image?')) return;
        Inertia.post(route('profile.image.delete'), { type }, {
            preserveScroll: true,
        });
    };

    const loadMore = async () => {
        if (!nextPageUrl) return;
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        setAllPosts([...allPosts, ...data.data]);
        setNextPageUrl(data.next_page_url);
    };

    const content = (
        <div className="max-w-4xl mx-auto pb-20">
            <Head title={`${user?.name || 'User'}'s Profile`} />
            <div className="w-full h-60 bg-gray-300 relative">
                {user?.cover && <img src={getImageUrl(user.cover)} className="w-full h-full object-cover" alt="cover" />}
                {loggedInUser && isOwner && (
                    <div className="absolute top-2 right-2 space-x-2">
                        <input type="file" accept="image/*" id="cover-upload" onChange={(e) => handleFileChange(e, 'cover')} className="hidden" />
                        <label htmlFor="cover-upload" className="text-sm text-white bg-black/50 px-2 py-1 rounded cursor-pointer">{user.cover ? 'Change Cover' : 'Add Cover'}</label>
                        {user.cover && <button onClick={() => deleteImage('cover')} className="text-sm bg-red-600 text-white px-2 py-1 rounded">{t('delete')}</button>}
                    </div>
                )}
                <div className="absolute -bottom-12 left-4">
                    {user?.avatar ? (
                        <img src={getImageUrl(user.avatar)} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow" />
                    ) : (
                        <img
                            src="/default-avatar.png"
                            alt="default avatar"
                            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
                        />
                    )}
                    {loggedInUser && isOwner && (
                        <div className="mt-2">
                            <input type="file" accept="image/*" id="avatar-upload" onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" />
                            <label htmlFor="avatar-upload" className="text-blue-600 text-sm cursor-pointer">{user.avatar ? 'Change Avatar' : 'Add Avatar'}</label>
                            {user.avatar && <button onClick={() => deleteImage('avatar')} className="ml-2 text-red-600 text-sm">{t('delete')}</button>}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-16 px-4">
                <h1 className="text-xl font-bold">{user?.name || 'User Profile'}</h1>
                {isOwner && (
                    <div className="mt-4 flex space-x-4">
                        <Link href={route('profile.followers', user.username)} className="text-blue-600 underline">Followers</Link>
                        <Link href={route('profile.following', user.username)} className="text-blue-600 underline">Following</Link>
                    </div>
                )}
                {user?.username && <p className="text-gray-500">@{user.username}</p>}
                {user?.bio && <p className="text-gray-500">Bio : {user.bio}</p>}
                {user && <SocialLinks user={user} />}
                {loggedInUser && !isOwner && (
                    <div className="px-4 mt-4 flex space-x-4">
                        <Link href={route('chat.show', user.id)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('message')}</Link>
                        <button onClick={() => Inertia.post(route('follow.toggle', user.username), {}, { onSuccess: () => setFollowing(!following) })} className={`px-4 py-2 ${following ? 'bg-gray-600' : 'bg-blue-600'} text-white rounded hover:opacity-90`}>
                            {following ? 'Following' : 'Follow'}
                        </button>
                        <button
                            onClick={() => {
                                if (blocked) {
                                    Inertia.delete(route('user.unblock', user.username), {}, {
                                        onSuccess: () => setBlocked(false),
                                    });
                                } else {
                                    Inertia.post(route('user.block', user.username), {}, {
                                        onSuccess: () => setBlocked(true),
                                    });
                                }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90"
                        >
                            {blocked ? t('unblock') : t('block')}
                        </button>
                    </div>
                )}
            </div>

            {imageSrc && (
                <div className="mt-8 px-4 space-y-4">
                    <div className="relative w-full h-80 bg-gray-100 border rounded overflow-hidden">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={selectedType === 'avatar' ? 1 : 820 / 360}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                    <div className="flex space-x-4 items-center">
                        <button onClick={uploadCroppedImage} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Image'}</button>
                        <button onClick={() => { setImageSrc(null); setSelectedType(null); }} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500" disabled={isUploading}>{t('cancel')}</button>
                        {isUploading && <span className="text-sm text-gray-500 animate-pulse">{t('uploading_please_wait')}</span>}
                    </div>
                </div>
            )}

            <div className="px-4 mt-10 space-y-6">
                {allPosts.map((post) => <PostCard key={post.id} post={post} captcha={captcha} />)}
            </div>

            {nextPageUrl && (
                <div className="text-center mt-6">
                    <button onClick={loadMore} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('load_more')}</button>
                </div>
            )}

            <div className="flex items-center justify-center mt-10">
                <Link href="/" className="text-center text-gray-600 hover:text-blue-600 transition">
                    {t('Made_with')} <span className="text-red-500">❤️</span> {t('by')} <span className="font-semibold">{appName}</span>
                </Link>
            </div>
        </div>
    );

    return loggedInUser ? (
        <AuthenticatedLayout>
            {content}
        </AuthenticatedLayout>
    ) : content;
}
