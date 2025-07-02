import { useEffect, useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import MessageReactions from '@/Components/MessageReactions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from 'react-i18next';

// Custom SVG Icons
const EmojiIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 9C9.33 9 10 8.33 10 7.5S9.33 6 8.5 6 7 6.67 7 7.5 7.67 9 8.5 9zM12 18c-2.28 0-4.22-1.66-5-4h10c-.78 2.34-2.72 4-5 4zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 6 15.5 6 14 6.67 14 7.5 14.67 9 15.5 9z"/>
    </svg>
);

const AttachIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
    </svg>
);

const MicIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
    </svg>
);

const StopIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h12v12H6z"/>
    </svg>
);

const SendIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>
);

const EditIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
);

const DeleteIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
);

const SunIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
    </svg>
);

export default function ChatPage({ user = null, messages: initialMessages, room_name = null }) {
    const [messages, setMessages] = useState(initialMessages);
    const [prevMessageCount, setPrevMessageCount] = useState(initialMessages.length);
    const [messageReactions, setMessageReactions] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [seenStatus, setSeenStatus] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });
    const fileRef = useRef();
    const scrollRef = useRef();
    const { t } = useTranslation();

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

    const { data: formData, setData, post } = useForm({
        content: '',
        file: null,
        ...(user?.id ? { receiver_id: user.id } : {}),
        ...(room_name ? { room_name: room_name } : {}),
    });

    // Dark mode toggle
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark', newDarkMode);
        }
    };

    // Initialize dark mode
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', isDarkMode);
        }
    }, [isDarkMode]);

    useEffect(() => {
        const interval = setInterval(() => {
            const path = room_name ? `/chat/place/${room_name}/json` : `/chat/${user.username}/json`;

            fetch(path)
                .then((res) => res.json())
                .then((data) => {
                    setMessages((prevMessages) => {
                        const isNewMessage = data.messages.length > prevMessages.length;
                        if (isNewMessage) {
                            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                            setPrevMessageCount(data.messages.length);
                        }
                        const reactions = {};
                        for (const msg of data.messages) {
                            reactions[msg.id] = msg.reactions || [];
                        }
                        setMessageReactions(reactions);
                        return data.messages;
                    });
                    if (!room_name) setSeenStatus(data.seen);
                });

            if (!room_name && user?.username) {
                fetch(`/chat/seen/${user.username}`, { method: 'POST' });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [user?.id, room_name]);

    useEffect(() => {
        if (!formData.content) {
            setIsTyping(false);
            return;
        }
        setIsTyping(true);
        const timeout = setTimeout(() => setIsTyping(false), 1500);
        return () => clearTimeout(timeout);
    }, [formData.content]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                setData('file', new File([blob], 'voice.webm', { type: 'audio/webm' }));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!formData.content.trim() && !formData.file) return;

        post('/chat/send', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('content', '');
                setData('file', null);
                setAudioBlob(null);
                if (fileRef.current) fileRef.current.value = '';
                setShowEmoji(false);
            },
            onError: (errors) => {
                console.error('Error during send:', errors);
            },
        });
    };

    const handleEmojiSelect = (emoji) => {
        setData('content', formData.content + emoji.native);
        setShowEmoji(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('delete_message_confirm'))) {
            fetch(`/chat/message/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
        }
    };

    const handleEdit = (msg) => {
        const newContent = prompt(t('edit_message_prompt'), msg.content);
        if (!newContent || newContent === msg.content) return;
        fetch(`/chat/message/${msg.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({ content: newContent }),
        });
    };

    const triggerFileInput = () => {
        fileRef.current?.click();
    };

    const renderFile = (filePath) => {
        if (!filePath) return null;
        const ext = filePath.split('.').pop().toLowerCase();
        const src = `/storage/${filePath}`;
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return (
                <div className="mt-3 rounded-xl overflow-hidden max-w-sm">
                    <img 
                        src={src} 
                        alt="uploaded" 
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-200 cursor-pointer" 
                        onClick={() => window.open(src, '_blank')}
                    />
                </div>
            );
        }
        if (['mp4', 'mov', 'webm'].includes(ext)) {
            return (
                <div className="mt-3 rounded-xl overflow-hidden max-w-sm">
                    <video 
                        src={src} 
                        controls 
                        className="w-full h-auto rounded-xl bg-black/10 dark:bg-white/10" 
                    />
                </div>
            );
        }
        if (['webm', 'mp3', 'wav'].includes(ext)) {
            return (
                <div className="mt-3 p-3 bg-black/5 dark:bg-white/5 rounded-xl max-w-sm">
                    <audio controls className="w-full">
                        <source src={src} type={`audio/${ext}`} />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            );
        }
        return (
            <a 
                href={src} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-xl text-sm hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
                <AttachIcon className="w-4 h-4" />
                Download File
            </a>
        );
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'الان';
        if (minutes < 60) return `${minutes} دقیقه قبل`;
        if (hours < 24) return `${hours} ساعت قبل`;
        if (days < 7) return `${days} روز قبل`;
        return date.toLocaleDateString('fa-IR');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {room_name ? t('group_chat', { room_name }) : t('chat_with_user', { name: user?.name })}
                        </h2>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                }
            >
                <Head title={t('chat')} />

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="relative flex flex-col h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                            <div className="flex items-center gap-3">
                                {user?.avatar ? (
                                    <img 
                                        src={`/storage/${user.avatar}`} 
                                        alt={user.name} 
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20" 
                                    />
                                ) : room_name ? (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        #
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {room_name || user?.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {room_name ? 'Group Chat' : (seenStatus ? 'آنلاین' : 'آفلاین')}
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {messages.length} پیام
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
                            {messages.map((msg, index) => {
                                const isMine = msg.sender_id === (user?.id ?? formData.receiver_id);
                                const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                                const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender_id !== msg.sender_id;

                                return (
                                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
                                        <div className={`relative max-w-xs sm:max-w-md lg:max-w-lg ${isMine ? 'order-2' : 'order-1'}`}>
                                            {/* Message Bubble */}
                                            <div className={`relative p-4 rounded-2xl shadow-sm ${
                                                isMine 
                                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-12' 
                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-12 border border-gray-200 dark:border-gray-700'
                                            } ${showAvatar ? (isMine ? 'rounded-br-md' : 'rounded-bl-md') : ''}`}>
                                                
                                                {/* Sender Info */}
                                                {!isMine && showAvatar && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <a href={`/${msg.sender.username}`} className="flex items-center gap-2 hover:underline">
                                                            {msg.sender.avatar ? (
                                                                <img 
                                                                    src={`/storage/${msg.sender.avatar}`} 
                                                                    alt={msg.sender.name} 
                                                                    className="w-6 h-6 rounded-full object-cover" 
                                                                />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center text-xs font-bold">
                                                                    {msg.sender.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                                {msg.sender.name}
                                                            </span>
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Message Content */}
                                                <div className="space-y-2">
                                                    {msg.content && msg.content !== '(message deleted)' && (
                                                        <p className="text-sm leading-relaxed break-words">
                                                            {msg.content}
                                                        </p>
                                                    )}
                                                    
                                                    {msg.content === '(message deleted)' && (
                                                        <p className="text-xs italic opacity-60">
                                                            {t('message_deleted')}
                                                        </p>
                                                    )}

                                                    {renderFile(msg.file_path)}
                                                </div>

                                                {/* Message Footer */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2 text-xs opacity-60">
                                                        <span>{formatTime(msg.created_at)}</span>
                                                        {msg.is_edited && msg.content !== '(message deleted)' && (
                                                            <span className="italic">ویرایش شده</span>
                                                        )}
                                                    </div>
                                                    
                                                    {!room_name && isMine && isLastInGroup && seenStatus && (
                                                        <div className="text-xs opacity-60">
                                                            ✓✓ {t('seen')}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Edit/Delete Buttons */}
                                                {isMine && msg.content !== '(message deleted)' && (
                                                    <div className="absolute -top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button 
                                                            onClick={() => handleEdit(msg)}
                                                            className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                                            title={t('edit_message')}
                                                        >
                                                            <EditIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(msg.id)}
                                                            className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title={t('delete_message')}
                                                        >
                                                            <DeleteIcon className="w-3 h-3 text-red-500" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Reactions */}
                                            <MessageReactions
                                                messageId={msg.id}
                                                reactions={messageReactions[msg.id] || []}
                                                currentUserId={user?.id}
                                                refresh={(newList) => setMessageReactions((prev) => ({ ...prev, [msg.id]: newList }))}
                                            />
                                        </div>

                                        {/* Avatar for others */}
                                        {!isMine && isLastInGroup && (
                                            <div className="order-1 mr-3 self-end mb-1">
                                                {msg.sender.avatar ? (
                                                    <img 
                                                        src={`/storage/${msg.sender.avatar}`} 
                                                        alt={msg.sender.name} 
                                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" 
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center text-sm font-bold ring-2 ring-gray-200 dark:ring-gray-700">
                                                        {msg.sender.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span>{t('typing')}</span>
                                </div>
                            </div>
                        )}

                        {/* Input Form */}
                        <div className="relative p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            {/* Emoji Picker */}
                            {showEmoji && (
                                <div className="absolute bottom-full left-4 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden">
                                    <Picker 
                                        data={data} 
                                        onEmojiSelect={handleEmojiSelect}
                                        theme={isDarkMode ? 'dark' : 'light'}
                                        previewPosition="none"
                                        skinTonePosition="none"
                                    />
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-3">
                                {/* Voice Recording Preview */}
                                {audioURL && (
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-3">
                                            <MicIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <audio controls className="flex-1 h-8">
                                                <source src={audioURL} type="audio/webm" />
                                                Your browser does not support the audio element.
                                            </audio>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAudioBlob(null);
                                                    setData('file', null);
                                                }}
                                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            >
                                                <DeleteIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* File Preview */}
                                {formData.file && !audioBlob && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <AttachIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                                    {formData.file.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData('file', null);
                                                    if (fileRef.current) fileRef.current.value = '';
                                                }}
                                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                            >
                                                <DeleteIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Main Input Area */}
                                <div className="flex items-end gap-3">
                                    {/* Text Input */}
                                    <div className="flex-1 relative">
                                        <textarea
                                            className="w-full px-4 py-3 pr-12 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                                            placeholder={t('type_message_placeholder')}
                                            value={formData.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    submit(e);
                                                }
                                            }}
                                            rows={1}
                                            style={{
                                                minHeight: '48px',
                                                maxHeight: '120px',
                                                height: Math.min(48 + (formData.content.split('\n').length - 1) * 20, 120) + 'px'
                                            }}
                                        />
                                        
                                        {/* Emoji Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowEmoji(!showEmoji)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all"
                                            title={t('pick_emoji')}
                                        >
                                            <EmojiIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {/* Voice Recording Button */}
                                        <button
                                            type="button"
                                            onClick={recording ? stopRecording : startRecording}
                                            className={`p-3 rounded-2xl transition-all shadow-sm ${
                                                recording
                                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                            title={recording ? t('stop_recording') : t('start_recording')}
                                        >
                                            {recording ? <StopIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                                        </button>

                                        {/* File Attachment Button */}
                                        <button
                                            type="button"
                                            onClick={triggerFileInput}
                                            className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all shadow-sm"
                                            title={t('attach_file')}
                                        >
                                            <AttachIcon className="w-5 h-5" />
                                        </button>

                                        {/* Send Button */}
                                        <button
                                            type="submit"
                                            disabled={!formData.content.trim() && !formData.file}
                                            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white rounded-2xl transition-all shadow-sm disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                                            title={t('send')}
                                        >
                                            <SendIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                <input 
                                    type="file" 
                                    ref={fileRef} 
                                    accept="image/*,video/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                    onChange={(e) => setData('file', e.target.files[0])} 
                                    className="hidden" 
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}