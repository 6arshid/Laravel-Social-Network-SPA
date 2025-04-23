import { useEffect, useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import MessageReactions from '@/Components/MessageReactions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ChatPage({ user = null, messages: initialMessages, room_name = null }) {
    const [messages, setMessages] = useState(initialMessages);
    const [prevMessageCount, setPrevMessageCount] = useState(initialMessages.length);
    const [messageReactions, setMessageReactions] = useState({});
    const [showEmoji, setShowEmoji] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [seenStatus, setSeenStatus] = useState(false);
    const fileRef = useRef();
    const scrollRef = useRef();

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
            onError: (errors) => {
                console.error('Error during send:', errors);
            },
        });
    };

    const handleEmojiSelect = (emoji) => {
        setData('content', formData.content + emoji.native);
    };

    const handleDelete = (id) => {
        if (confirm('Delete this message?')) {
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
        const newContent = prompt('Edit your message:', msg.content);
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
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {room_name ? `Group Chat: ${room_name}` : `Chat with ${user?.name}`}
                </h2>
            }
        >
            <Head title="Chat" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col h-[85vh] bg-gray-50 rounded-lg shadow p-4 relative">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                        {messages.map((msg) => {
                            const isMine = msg.sender_id === (user?.id ?? formData.receiver_id);
                            return (
                                <div
                                    key={msg.id}
                                    className={`relative max-w-sm p-2 rounded-xl ${
                                        isMine ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <a href={`/${msg.sender.username}`} className="flex items-center gap-2 hover:underline">
                                            {msg.sender.avatar ? (
                                                <img
                                                    src={`/storage/${msg.sender.avatar}`}
                                                    alt={msg.sender.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">
                                                    {msg.sender.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold">{msg.sender.name}</span>
                                        </a>
                                    </div>
                                    <div>
                                        {msg.content && <p>{msg.content}</p>}
                                        {msg.is_edited && msg.content !== '(message deleted)' && (
                                            <span className="text-xs italic ml-2">(edited)</span>
                                        )}
                                        {msg.content === '(message deleted)' && (
                                            <span className="text-xs italic ml-2">(deleted)</span>
                                        )}
                                        {renderFile(msg.file_path)}
                                    </div>
                                    <MessageReactions
                                        messageId={msg.id}
                                        reactions={messageReactions[msg.id] || []}
                                        currentUserId={user?.id}
                                        refresh={(newList) =>
                                            setMessageReactions((prev) => ({
                                                ...prev,
                                                [msg.id]: newList,
                                            }))
                                        }
                                    />
                                    {isMine && msg.content !== '(message deleted)' && (
                                        <div className="absolute top-1 right-2 flex gap-2 text-xs text-white">
                                            <button onClick={() => handleEdit(msg)} title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(msg.id)} title="Delete">🗑️</button>
                                        </div>
                                    )}
                                    {!room_name && isMine && msg.id === messages[0]?.id && seenStatus && (
                                        <div className="text-xs text-right mt-1">✅ Seen</div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={scrollRef} />
                    </div>

                    {isTyping && <div className="text-sm text-gray-500 mb-2">Typing...</div>}

                    <form onSubmit={submit} className="mt-auto flex flex-col gap-2 relative">
                        {showEmoji && (
                            <div className="absolute bottom-full mb-2 left-0 z-50">
                                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowEmoji(!showEmoji)}
                                className="text-2xl px-2"
                                title="Pick emoji"
                            >
                                😊
                            </button>

                            <input
                                type="text"
                                className="flex-1 border rounded-lg p-2"
                                placeholder="Type a message..."
                                value={formData.content}
                                onChange={(e) => setData('content', e.target.value)}
                            />

                            {!recording ? (
                                <button
                                    type="button"
                                    onClick={startRecording}
                                    className="text-2xl px-2 text-red-500"
                                    title="Start voice recording"
                                >
                                    🎙️
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="text-2xl px-2 text-green-600"
                                    title="Stop recording"
                                >
                                    ⏹️
                                </button>
                            )}

                            <input
                                type="file"
                                ref={fileRef}
                                accept="image/*,video/*"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="hidden"
                            />

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Send
                            </button>
                        </div>

                        {audioURL && (
                            <audio controls className="mt-2">
                                <source src={audioURL} type="audio/webm" />
                                Your browser does not support the audio element.
                            </audio>
                        )}
                    </form>
                </div>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4 z-50">
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(document.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="block text-green-600">
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.7.7 5.3 2.1 7.6L.5 31.5l8.2-2.1c2.2 1.2 4.7 1.8 7.3 1.8 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.6c-2.2 0-4.3-.6-6.2-1.7l-.4-.2-4.9 1.2 1.3-4.8-.3-.4c-1.3-2-2-4.2-2-6.5C3.5 9.1 9.1 3.5 16 3.5c6.9 0 12.5 5.6 12.5 12.5S22.9 29.1 16 29.1z"/>
                        <path d="M24.2 19.7l-2.9-1.2c-.4-.2-.9-.2-1.2.1l-1.7 1.4c-2.4-1.3-4.3-3.1-5.6-5.6l1.4-1.7c.3-.3.3-.8.1-1.2l-1.2-2.9c-.2-.5-.8-.7-1.3-.5-1 .4-2.2 1.4-2.2 3.4 0 1.1.5 2.4 1.4 3.8 1.5 2.3 3.7 4.5 6 5.5 1.1.5 2 .8 2.8.8 2 0 3.1-1.2 3.4-2.2.2-.5 0-1.1-.5-1.3z"/>
                    </svg>
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`} target="_blank" rel="noopener noreferrer" className="block text-blue-500">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.484 15.477l-.391 4.363c.56 0 .803-.24 1.097-.527l2.63-2.515 5.451 3.982c1 .553 1.715.264 1.976-.931l3.58-16.744-.001-.001c.316-1.476-.539-2.056-1.519-1.713L1.178 9.228c-1.456.575-1.439 1.394-.25 1.763l5.623 1.756 13.038-8.237-10.106 11.014z" />
                    </svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`} target="_blank" rel="noopener noreferrer" className="block text-black">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 001.85-2.35 8.45 8.45 0 01-2.7 1.03A4.23 4.23 0 0015.5 4a4.26 4.26 0 00-4.26 4.26c0 .33.04.66.1.97A12.07 12.07 0 013 5.15a4.27 4.27 0 001.32 5.68 4.21 4.21 0 01-1.92-.53v.05a4.27 4.27 0 003.42 4.18 4.28 4.28 0 01-1.91.07 4.27 4.27 0 003.98 2.96 8.5 8.5 0 01-6.26 1.75A12.01 12.01 0 008.3 21c7.73 0 11.96-6.4 11.96-11.96 0-.18-.01-.36-.02-.54A8.55 8.55 0 0022.46 6z" />
                    </svg>
                </a>
                <a href={`mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(window.location.href)}`} className="block text-red-600">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.24l-8 5-8-5V6l8 5 8-5v2.24z" />
                    </svg>
                </a>
                <a href={`sms:?body=${encodeURIComponent(document.title + ' ' + window.location.href)}`} className="block text-gray-700">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4v20l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9H6v-2h12v2z" />
                    </svg>
                </a>
            </div>
        </AuthenticatedLayout>
    );
}
