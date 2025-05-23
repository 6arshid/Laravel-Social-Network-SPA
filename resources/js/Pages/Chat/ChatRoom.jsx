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
    const { t } = useTranslation();
    const fileRef = useRef();
    const scrollRef = useRef();

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioURL = audioBlob ? URL.createObjectURL(audioBlob) : null;

    const { data: formData, setData, post } = useForm({
        content: '',
        file: null,
        receiver_id: user.id,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/chat/${user.username}/json`)
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
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/chat/send', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('content', '');
                setData('file', null);
                setAudioBlob(null);
                fileRef.current.value = null;
                setShowEmoji(false);
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
            return <img src={src} alt="uploaded" className="mt-2 max-w-xs rounded" />;
        }
        if (['mp4', 'mov', 'webm'].includes(ext)) {
            return <video src={src} controls className="mt-2 max-w-xs rounded" />;
        }
        if (['webm', 'mp3', 'wav'].includes(ext)) {
            return <audio controls src={src} className="mt-2 max-w-xs" />;
        }
        return (
            <a href={src} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm underline">
                Download File
            </a>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">{t('chat_with_user', { name: user.name })}</h2>}
        >
            <Head title={t('chat')} />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="p-4 flex flex-col h-screen bg-gray-50 text-black rounded-lg shadow">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                        {[...messages].reverse().map((msg) => {
                            const isMine = msg.sender_id !== user.id;
                            return (
                                <div key={msg.id} className={`relative max-w-sm p-2 rounded-xl ${isMine ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}>
                                    <div>
                                        {msg.content && <p>{msg.content}</p>}
                                        {msg.is_edited && msg.content !== '(message deleted)' && <span className="text-xs italic ml-2">{t('message_edited')}</span>}
                                        {msg.content === '(message deleted)' && <span className="text-xs italic ml-2">{t('message_deleted')}</span>}
                                        {renderFile(msg.file_path)}
                                    </div>
                                    <MessageReactions
                                        messageId={msg.id}
                                        reactions={messageReactions[msg.id] || []}
                                        currentUserId={user.id}
                                        refresh={(newList) => setMessageReactions((prev) => ({ ...prev, [msg.id]: newList }))}
                                    />
                                    {isMine && msg.content !== '(message deleted)' && (
                                        <div className="absolute top-1 right-2 flex gap-2 text-xs text-white">
                                            <button onClick={() => handleEdit(msg)} title={t('edit_message')}>✏️</button>
                                            <button onClick={() => handleDelete(msg.id)} title={t('delete_message')}>🗑️</button>
                                        </div>
                                    )}
                                    {isMine && msg.id === messages[0]?.id && seenStatus && (
                                        <div className="text-xs text-right mt-1">✅ {t('seen')}</div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>

                    {isTyping && <div className="text-sm text-gray-500 mb-2">{t('typing')}</div>}

                    <form onSubmit={submit} className="mt-auto relative">
                        {showEmoji && (
                            <div className="absolute bottom-24 left-0 z-50">
                                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-2xl p-2" title={t('pick_emoji')}>
                                😊
                            </button>
                            <input
                                type="text"
                                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                placeholder={t('type_message_placeholder')}
                                value={formData.content}
                                onChange={(e) => setData('content', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-2 gap-2">
                            {!recording ? (
                                <button type="button" onClick={startRecording} className="text-2xl p-2 text-red-500" title={t('start_recording')}>
                                    🎙️
                                </button>
                            ) : (
                                <button type="button" onClick={stopRecording} className="text-2xl p-2 text-green-600" title={t('stop_recording')}>
                                    ⏹️
                                </button>
                            )}

                            <button type="button" onClick={triggerFileInput} className="text-2xl p-2" title={t('attach_file')}>
                                📎
                            </button>

                            <input type="file" ref={fileRef} accept="image/*,video/*,audio/*" onChange={(e) => setData('file', e.target.files[0])} className="hidden" />

                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm" title={t('send')}>
                                {t('send')}
                            </button>
                        </div>

                        {audioURL && (
                            <audio controls className="mt-2 w-full">
                                <source src={audioURL} type="audio/webm" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}