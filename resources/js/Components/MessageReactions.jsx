import React, { useState, useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageReactions({ messageId, reactions, currentUserId, refresh }) {
    const [showPicker, setShowPicker] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pickerRef = useRef(null);
    const buttonRef = useRef(null);

    // Check for dark mode preference
    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'true' || 
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(darkModePreference);
    }, []);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Group reactions by emoji
    const grouped = reactions.reduce((acc, r) => {
        acc[r.emoji] = acc[r.emoji] || [];
        acc[r.emoji].push(r.user_id);
        return acc;
    }, {});

    const handleReactionClick = async (emoji) => {
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
        handleReactionClick(emoji.native);
        setShowPicker(false);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
    };

    const PlusIcon = () => (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );

    const MoonIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    const SunIcon = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    return (
        <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className="flex flex-wrap gap-2 items-center mt-2 relative">
                {/* Existing Reactions */}
                <AnimatePresence mode="popLayout">
                    {Object.entries(grouped).map(([emoji, users]) => {
                        const isUserReacted = users.includes(currentUserId);
                        const count = users.length;
                        
                        return (
                            <motion.button
                                key={emoji}
                                onClick={() => handleReactionClick(emoji)}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                    scale: 1, 
                                    opacity: 1,
                                    y: 0
                                }}
                                exit={{ 
                                    scale: 0, 
                                    opacity: 0,
                                    y: -10
                                }}
                                whileHover={{ 
                                    scale: 1.05,
                                    y: -2
                                }}
                                whileTap={{ 
                                    scale: 0.95 
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }}
                                className={`
                                    group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                                    text-sm font-medium cursor-pointer transition-all duration-200
                                    backdrop-blur-sm border shadow-sm
                                    ${isUserReacted 
                                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 text-blue-600 dark:text-blue-400 shadow-blue-500/20' 
                                        : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                `}
                            >
                                <span className="text-base leading-none">{emoji}</span>
                                <span className={`
                                    text-xs font-semibold px-1.5 py-0.5 rounded-full
                                    ${isUserReacted 
                                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' 
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }
                                `}>
                                    {count}
                                </span>
                                
                                {/* Hover tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                                    {isUserReacted ? 'Remove your reaction' : 'React with ' + emoji}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                                </div>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                {/* Add Reaction Button */}
                <motion.button
                    ref={buttonRef}
                    onClick={() => setShowPicker(!showPicker)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        flex items-center justify-center w-8 h-8 rounded-full
                        bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                        text-white shadow-lg hover:shadow-xl transition-all duration-200
                        backdrop-blur-sm border border-white/20
                        ${showPicker ? 'ring-2 ring-blue-500/50 ring-offset-2 dark:ring-offset-gray-900' : ''}
                    `}
                >
                    <motion.div
                        animate={{ rotate: showPicker ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PlusIcon />
                    </motion.div>
                </motion.button>

                {/* Dark Mode Toggle */}
                <motion.button
                    onClick={toggleDarkMode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                    <motion.div
                        initial={false}
                        animate={{ rotate: isDarkMode ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                    </motion.div>
                </motion.button>

                {/* Emoji Picker */}
                <AnimatePresence>
                    {showPicker && (
                        <motion.div
                            ref={pickerRef}
                            initial={{ 
                                opacity: 0, 
                                scale: 0.8, 
                                y: 10 
                            }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1, 
                                y: 0 
                            }}
                            exit={{ 
                                opacity: 0, 
                                scale: 0.8, 
                                y: 10 
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                            className="absolute top-full left-0 mt-2 z-50 rounded-lg overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-lg">
                                <Picker 
                                    data={data} 
                                    onEmojiSelect={handlePickerSelect} 
                                    theme={isDarkMode ? "dark" : "light"}
                                    previewPosition="none"
                                    skinTonePosition="none"
                                    searchPosition="top"
                                    maxFrequentRows={2}
                                    perLine={8}
                                    set="apple"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Background overlay when picker is open */}
                <AnimatePresence>
                    {showPicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
                            onClick={() => setShowPicker(false)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Reaction Statistics */}
            {reactions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-xs text-gray-500 dark:text-gray-400"
                >
                    <span className="font-medium">
                        {reactions.length} {reactions.length === 1 ? 'reaction' : 'reactions'}
                    </span>
                    {Object.keys(grouped).length > 1 && (
                        <span className="ml-2">
                            • {Object.keys(grouped).length} different emojis
                        </span>
                    )}
                </motion.div>
            )}
        </div>
    );
}