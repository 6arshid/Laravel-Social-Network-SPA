import { useEffect, useState, useRef } from 'react';
import { useForm, Head } from '@inertiajs/react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import MessageReactions from '@/Components/MessageReactions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ChatPage({ user = null, messages: initialMessages, room_name = null }) {
    const [messages, setMessages] = useState(initialMessages);
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
                    setMessages(data.messages);
                    if (!room_name) setSeenStatus(data.seen);
                    const reactions = {};
                    for (const msg of data.messages) {
                        reactions[msg.id] = msg.reactions || [];
                    }
                    setMessageReactions(reactions);
                });
            if (!room_name && user?.username) {
                fetch(`/chat/seen/${user.username}`, { method: 'POST' });
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [user?.id, room_name]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        </AuthenticatedLayout>
    );
}