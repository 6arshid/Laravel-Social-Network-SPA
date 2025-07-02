import { useEffect, useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import MessageReactions from '@/Components/MessageReactions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from 'react-i18next';

export default function ChatPage({ user, messages: initialMessages }) {
    const [messages, setMessages] = useState(initialMessages);
    const [prevMessageCount, setPrevMessageCount] = useState(initialMessages.length);
    const [messageReactions, setMessageReactions] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [seenStatus, setSeenStatus] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { t } = useTranslation();
    const fileRef = useRef();
    const scrollRef = useRef();
    const messagesEndRef = useRef();

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

    const { data: formData, setData, post } = useForm({
        content: '',
        file: null,
        receiver_id: user.id,
    });

    // Dark mode toggle effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/chat/${user.username}/json`)
                .then((res) => res.json())
                .then((data) => {
                    setMessages((prevMessages) => {
                        const isNewMessage = data.messages.length > prevMessages.length;
                        if (isNewMessage) {
                            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                            setPrevMessageCount(data.messages.length);
                        }

                        const reactions = {};
                        for (const msg of data.messages) {
                            reactions[msg.id] = msg.reactions || [];
                        }
                        setMessageReactions(reactions);

                        return data.messages;
                    });

                    setSeenStatus(data.seen);
                });

            fetch(`/chat/seen/${user.username}`, { method: 'POST' });
        }, 2000);

        return () => clearInterval(interval);
    }, [user.id]);

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
            };
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
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
                if (fileRef.current) fileRef.current.value = null;
                setShowEmoji(false);
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            },
        });
    };

    const handleEmojiSelect = (emoji) => {
        setData('content', formData.content + emoji.native);
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
        fileRef.current.click();
    };

    const renderFile = (filePath) => {
        if (!filePath) return null;
        const ext = filePath.split('.').pop().toLowerCase();
        const src = `/storage/${filePath}`;
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return (
                <div className="mt-3 relative group cursor-pointer">
                    <img 
                        src={src} 
                        alt="uploaded" 
                        className="max-w-xs max-h-64 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                </div>
            );
        }
        if (['mp4', 'mov', 'webm'].includes(ext)) {
            return (
                <video 
                    src={src} 
                    controls 
                    className="mt-3 max-w-xs max-h-64 rounded-xl shadow-lg" 
                />
            );
        }
        if (['webm', 'mp3', 'wav'].includes(ext)) {
            return (
                <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                    <audio controls src={src} className="w-full max-w-xs" />
                </div>
            );
        }
        return (
            <a 
                href={src} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download File
            </a>
        );
    };

    // SVG Icons
    const EmojiIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const MicIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
    );

    const StopIcon = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
        </svg>
    );

    const AttachIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
    );

    const SendIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );

    const EditIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );

    const DeleteIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const DarkModeIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    const LightModeIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {seenStatus ? 'Online' : 'Last seen recently'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </button>
                    </div>
                }
            >
                <Head title={t('chat')} />

                <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
                        {/* Messages Container */}
                        <div className="h-[70vh] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                            {[...messages].reverse().map((msg, index) => {
                                const isMine = msg.sender_id !== user.id;
                                const isConsecutive = index > 0 && [...messages].reverse()[index - 1].sender_id === msg.sender_id;
                                
                                return (
                                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
                                        <div className={`relative max-w-xs sm:max-w-md lg:max-w-lg ${isConsecutive ? 'mt-1' : 'mt-4'}`}>
                                            {/* Message Bubble */}
                                            <div className={`
                                                relative px-4 py-3 rounded-2xl shadow-md
                                                ${isMine 
                                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                                                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600'
                                                }
                                                ${isConsecutive ? '' : 'shadow-lg'}
                                                hover:shadow-xl transition-all duration-300
                                            `}>
                                                {/* Message Content */}
                                                <div className="break-words">
                                                    {msg.content && msg.content !== '(message deleted)' && (
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    )}
                                                    
                                                    {msg.content === '(message deleted)' && (
                                                        <p className="text-xs italic opacity-70">{t('message_deleted')}</p>
                                                    )}
                                                    
                                                    {msg.is_edited && msg.content !== '(message deleted)' && (
                                                        <span className="text-xs opacity-70 ml-2 block mt-1">
                                                            {t('message_edited')}
                                                        </span>
                                                    )}
                                                    
                                                    {renderFile(msg.file_path)}
                                                </div>

                                                {/* Message Actions */}
                                                {isMine && msg.content !== '(message deleted)' && (
                                                    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={() => handleEdit(msg)}
                                                            className="p-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                                            title={t('edit_message')}
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(msg.id)}
                                                            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                                            title={t('delete_message')}
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Seen Status */}
                                                {isMine && msg.id === messages[0]?.id && seenStatus && (
                                                    <div className="text-xs opacity-70 text-right mt-2 flex items-center justify-end gap-1">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        {t('seen')}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Message Reactions */}
                                            <MessageReactions
                                                messageId={msg.id}
                                                reactions={messageReactions[msg.id] || []}
                                                currentUserId={user.id}
                                                refresh={(newList) => setMessageReactions((prev) => ({ ...prev, [msg.id]: newList }))}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-3 max-w-xs">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <form onSubmit={submit} className="relative">
                                {/* Emoji Picker */}
                                {showEmoji && (
                                    <div className="absolute bottom-full left-0 z-50 mb-2">
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <Picker 
                                                data={data} 
                                                onEmojiSelect={handleEmojiSelect}
                                                theme={darkMode ? 'dark' : 'light'}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Audio Preview */}
                                {audioURL && (
                                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <audio controls className="w-full">
                                            <source src={audioURL} type="audio/webm" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}

                                {/* Input Row */}
                                <div className="flex items-end gap-3">
                                    {/* Emoji Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowEmoji(!showEmoji)}
                                        className={`p-3 rounded-xl transition-all duration-200 ${
                                            showEmoji 
                                                ? 'bg-blue-500 text-white shadow-lg' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        title={t('pick_emoji')}
                                    >
                                        <EmojiIcon />
                                    </button>

                                    {/* Text Input */}
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-all duration-200"
                                            placeholder={t('type_message_placeholder')}
                                            value={formData.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    submit(e);
                                                }
                                            }}
                                        />
                                    </div>

                                    {/* Voice Recording Button */}
                                    <button
                                        type="button"
                                        onClick={recording ? stopRecording : startRecording}
                                        className={`p-3 rounded-xl transition-all duration-200 ${
                                            recording 
                                                ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-gray-600 hover:text-red-500'
                                        }`}
                                        title={recording ? t('stop_recording') : t('start_recording')}
                                    >
                                        {recording ? <StopIcon /> : <MicIcon />}
                                    </button>

                                    {/* File Attachment Button */}
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                                        title={t('attach_file')}
                                    >
                                        <AttachIcon />
                                    </button>

                                    {/* Send Button */}
                                    <button
                                        type="submit"
                                        disabled={!formData.content.trim() && !formData.file}
                                        className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                                        title={t('send')}
                                    >
                                        <SendIcon />
                                    </button>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileRef}
                                    accept="image/*,video/*,audio/*"
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