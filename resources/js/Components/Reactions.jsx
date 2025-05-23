import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Reactions({ postId, reactions = [], currentUserId }) {
    const [showPicker, setShowPicker] = useState(false);
    const [localReactions, setLocalReactions] = useState(reactions);

    const handleEmojiSelect = async (emoji) => {
        if (!currentUserId) {
            alert("برای واکنش دادن، باید وارد حساب کاربری شوید.");
            return;
        }

        try {
            const res = await axios.post(`/posts/${postId}/like`, {
                emoji: emoji.native
            });

            setLocalReactions(res.data.reactions);
            setShowPicker(false);
        } catch (err) {
            console.error("Error adding reaction:", err);
        }
    };

    const handleEmojiClick = async (emoji) => {
        if (!currentUserId) {
            alert("برای واکنش دادن، باید وارد حساب کاربری شوید.");
            return;
        }

        try {
            const res = await axios.post(`/posts/${postId}/like`, {
                emoji
            });

            setLocalReactions(res.data.reactions);
        } catch (err) {
            console.error("Error switching reaction:", err);
        }
    };

    const grouped = localReactions.reduce((acc, reaction) => {
        if (!reaction.emoji) return acc;
        acc[reaction.emoji] = acc[reaction.emoji] || [];
        acc[reaction.emoji].push(reaction.user_id);
        return acc;
    }, {});

    return (
        <div className="relative space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
                <AnimatePresence>
                    {Object.entries(grouped).map(([emoji, users]) => {
                        const isUserReacted = currentUserId && users.includes(currentUserId);
                        return (
                            <motion.span
                                key={emoji}
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.7, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                onClick={() => handleEmojiClick(emoji)}
                                className={`px-2 py-1 rounded-full text-xl border cursor-pointer transition-all duration-200 hover:scale-105
                                    ${isUserReacted ? 'bg-yellow-200 border-yellow-500' : 'bg-gray-100 border-gray-300'}
                                `}
                            >
                                {emoji} {users.length}
                            </motion.span>
                        );
                    })}
                </AnimatePresence>

                {/* Add new emoji */}
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full text-sm font-semibold"
                >
                    +
                </button>
            </div>

            {showPicker && (
                <div className="absolute z-50 mt-2">
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        emojiSize={20}
                        emojiButtonSize={28}
                        previewPosition="none"
                    />
                </div>
            )}
        </div>
    );
}
