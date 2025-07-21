import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true' || 
               (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
            
            {/* Floating Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-600 dark:to-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-300 to-indigo-300 dark:from-pink-600 dark:to-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

         

            <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 relative z-20">
                {/* Logo Section */}
                <div className="mb-8">
                    <Link href="/" className="group">
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
                            
                            {/* Logo Container */}
                            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105">
                                <ApplicationLogo className="h-16 w-16 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="w-full max-w-md">
                    <div className="relative">
                        {/* Card Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                        
                        {/* Main Card */}
                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header Gradient */}
                            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                            
                            {/* Content */}
                            <div className="p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Welcome to our platform
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-400"></div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
                    background-size: 24px 24px;
                }
                
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                
                /* Dark mode improvements */
                .dark .animate-blob {
                    opacity: 0.2;
                }
                
                /* Responsive improvements */
                @media (max-width: 640px) {
                    .bg-grid-pattern {
                        background-size: 20px 20px;
                    }
                }
            `}</style>
        </div>
    );
}