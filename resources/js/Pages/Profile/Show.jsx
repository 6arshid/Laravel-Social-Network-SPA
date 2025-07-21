import React, { useState, useCallback, useEffect } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
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
    const { auth, user, posts, isOwner, isFollowing, isBlocked, isBlockedBy, appName, captcha } = usePage().props;
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
    const [blockedBy, setBlockedBy] = useState(isBlockedBy);
    const [isUploading, setIsUploading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Dark mode toggle
    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

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

        router.post(route('profile.upload'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setImageSrc(null);
                setSelectedType(null);
                setIsUploading(false);
                router.reload({ only: ['user'] });
            },
            onError: () => {
                setIsUploading(false);
            },
        });
    };

    const deleteImage = (type) => {
        if (!confirm('Delete image?')) return;
        router.post(route('profile.image.delete'), { type }, {
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

    // SVG Icons
    const SunIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const MoonIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    const CameraIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const TrashIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const MessageIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );

    const UserPlusIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const UserMinusIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
        </svg>
    );

    const BlockIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
    );

    if (blockedBy) {
        const message = (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BlockIcon />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-600 dark:text-gray-400">This user has blocked you from viewing their profile.</p>
                </div>
            </div>
        );
        return loggedInUser ? (
            <AuthenticatedLayout>{message}</AuthenticatedLayout>
        ) : (
            message
        );
    }

    if (blocked) {
        const message = (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center space-y-6">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                        <BlockIcon />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Blocked</h2>
                        <p className="text-gray-600 dark:text-gray-400">You have blocked this user. Unblock to view their profile.</p>
                    </div>
                    <button
                        onClick={() =>
                            axios.delete(route('user.unblock', user.username)).then(() => setBlocked(false))
                        }
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Unblock User
                    </button>
                </div>
            </div>
        );
        return loggedInUser ? (
            <AuthenticatedLayout>{message}</AuthenticatedLayout>
        ) : (
            message
        );
    }

    const content = (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Head title={`${user?.name || 'User'}'s Profile`} />
            
   

            <div className="max-w-4xl mx-auto">
                {/* Cover Photo Section */}
                <div className="relative">
                    <div className="w-full h-72 md:h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
                        {user?.cover && (
                            <img 
                                src={getImageUrl(user.cover)} 
                                className="w-full h-full object-cover" 
                                alt="Cover" 
                            />
                        )}
                        <div className="absolute inset-0 bg-black/10"></div>
                        
                        {/* Cover Photo Controls */}
                        {loggedInUser && isOwner && (
                            <div className="absolute top-4 right-4 space-x-2">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    id="cover-upload" 
                                    onChange={(e) => handleFileChange(e, 'cover')} 
                                    className="hidden" 
                                />
                                <label 
                                    htmlFor="cover-upload" 
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-lg"
                                >
                                    <CameraIcon />
                                    <span className="text-sm font-medium">{user.cover ? 'Change Cover' : 'Add Cover'}</span>
                                </label>
                                {user.cover && (
                                    <button 
                                        onClick={() => deleteImage('cover')} 
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                                    >
                                        <TrashIcon />
                                        <span className="text-sm font-medium">Delete</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Picture */}
                    <div className="absolute -bottom-16 left-6 md:left-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                                {user?.avatar ? (
                                    <img 
                                        src={getImageUrl(user.avatar)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Avatar Upload Controls */}
                            {loggedInUser && isOwner && (
                                <div className="absolute -bottom-2 right-0">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        id="avatar-upload" 
                                        onChange={(e) => handleFileChange(e, 'avatar')} 
                                        className="hidden" 
                                    />
                                    <label 
                                        htmlFor="avatar-upload" 
                                        className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200"
                                    >
                                        <CameraIcon />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Info Section */}
                <div className="bg-white dark:bg-gray-800 pt-20 pb-8 px-6 md:px-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {user?.name || 'User Profile'}
                            </h1>
                            {user?.username && (
                                <p className="text-lg text-gray-500 dark:text-gray-400">@{user.username}</p>
                            )}
                            {user?.bio && (
                                <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                                    {user.bio}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {loggedInUser && !isOwner && (
                            <div className="flex flex-wrap gap-3">
                                <Link 
                                    href={route('chat.show', user.id)} 
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <MessageIcon />
                                    <span>Message</span>
                                </Link>
                                <button 
                                    onClick={() => router.post(route('follow.toggle', user.username), {}, { onSuccess: () => setFollowing(!following) })} 
                                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                                        following 
                                            ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                    }`}
                                >
                                    {following ? <UserMinusIcon /> : <UserPlusIcon />}
                                    <span>{following ? 'Following' : 'Follow'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (blocked) {
                                            axios.delete(route('user.unblock', user.username)).then(() => setBlocked(false));
                                        } else {
                                            axios.post(route('user.block', user.username)).then(() => setBlocked(true));
                                        }
                                    }}
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <BlockIcon />
                                    <span>{blocked ? 'Unblock' : 'Block'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Stats */}
                    {isOwner && (
                        <div className="mt-6 flex space-x-8">
                            <Link 
                                href={route('profile.followers', user.username)} 
                                className="group flex flex-col items-center space-y-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {user.followers_count || 0}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Followers</span>
                            </Link>
                            <Link 
                                href={route('profile.following', user.username)} 
                                className="group flex flex-col items-center space-y-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                    {user.following_count || 0}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Following</span>
                            </Link>
                        </div>
                    )}

                    {/* Social Links */}
                    {user && <SocialLinks user={user} />}
                </div>

                {/* Image Cropper Modal */}
                {imageSrc && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Crop {selectedType === 'avatar' ? 'Profile Picture' : 'Cover Photo'}
                                </h3>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="relative w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
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
                                
                                <div className="flex justify-end space-x-4">
                                    <button 
                                        onClick={() => { setImageSrc(null); setSelectedType(null); }} 
                                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 font-medium" 
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={uploadCroppedImage} 
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50" 
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Save Image'}
                                    </button>
                                </div>
                                
                                {isUploading && (
                                    <div className="text-center">
                                        <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm">Uploading, please wait...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                <div className="bg-white dark:bg-gray-800 mt-1">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Posts</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {allPosts.length > 0 ? (
                            allPosts.map((post) => (
                                <div key={post.id} className="p-6">
                                    <PostCard post={post} captcha={captcha} />
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {isOwner ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
                                </p>
                            </div>
                        )}
                    </div>

                    {nextPageUrl && (
                        <div className="p-6 text-center border-t border-gray-200 dark:border-gray-700">
                            <button 
                                onClick={loadMore} 
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Load More Posts
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-gray-800 mt-1 p-8 text-center">
                    <Link 
                        href="/" 
                        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                        <span>Made with</span>
                        <span className="text-red-500 text-lg">❤️</span>
                        <span>by</span>
                        <span className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {appName}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );

    return loggedInUser ? (
        <AuthenticatedLayout>
            {content}
        </AuthenticatedLayout>
    ) : content;
}