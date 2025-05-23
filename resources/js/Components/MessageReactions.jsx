import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageReactions({ messageId, reactions, currentUserId, refresh }) {
    const [showPicker, setShowPicker] = useState(false);
    const grouped = reactions.reduce((acc, r) => {
        acc[r.emoji] = acc[r.emoji] || [];
        acc[r.emoji].push(r.user_id);
        return acc;
    }, {});

    const handleClick = async (emoji) => {
        try {
            const res = await axios.post(`/chat/message/${messageId}/react`, {
                emoji
            });
            refresh(res.data.reactions);
        } catch (err) {
            console.error("Reaction error:", err);
        }
    };

    const handlePickerSelect = (emoji) => {
        handleClick(emoji.native);
        setShowPicker(false);
    };

    return (
        <div className="flex gap-1 items-center mt-1 relative">
            <AnimatePresence>
                {Object.entries(grouped).map(([emoji, users]) => {
                    const isUserReacted = users.includes(currentUserId);
                    return (
                        <motion.span
                            key={emoji}
                            onClick={() => handleClick(emoji)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            className={`text-sm px-2 py-1 rounded-full border cursor-pointer ${
                                isUserReacted ? 'bg-yellow-200 border-yellow-400' : 'bg-gray-100 border-gray-300'
                            }`}
                        >
                            {emoji} {users.length}
                        </motion.span>
                    );
                })}
            </AnimatePresence>

            <button
                onClick={() => setShowPicker(!showPicker)}
                className="text-xs bg-blue-100 px-1.5 py-0.5 rounded hover:bg-blue-200"
            >
                +
            </button>

            {showPicker && (
                <div className="absolute z-50 mt-2">
                    <Picker data={data} onEmojiSelect={handlePickerSelect} theme="light" />
                </div>
            )}
        </div>
    );
}
