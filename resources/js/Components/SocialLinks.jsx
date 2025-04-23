import React from 'react';

export default function SocialLinks({ user }) {
    const links = [
        { name: 'Instagram', username: user.instagram, url: `https://instagram.com/${user.instagram}`, color: 'text-pink-500', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2C4.678 2 2 4.678 2 7.75v8.5C2 19.322 4.678 22 7.75 22h8.5c3.072 0 5.75-2.678 5.75-5.75v-8.5C22 4.678 19.322 2 16.25 2h-8.5zm0 1.5h8.5c2.351 0 4.25 1.899 4.25 4.25v8.5c0 2.351-1.899 4.25-4.25 4.25h-8.5C5.399 20.5 3.5 18.601 3.5 16.25v-8.5C3.5 5.399 5.399 3.5 7.75 3.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm4.25-2.5a1 1 0 100 2 1 1 0 000-2z" /></svg> },
        { name: 'Twitter', username: user.twitter, url: `https://twitter.com/${user.twitter}`, color: 'text-blue-500', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6.003c-.793.352-1.644.589-2.538.697a4.487 4.487 0 001.975-2.474 9.01 9.01 0 01-2.846 1.088 4.481 4.481 0 00-7.633 4.085A12.717 12.717 0 013.15 4.77a4.48 4.48 0 001.388 5.975 4.465 4.465 0 01-2.032-.56v.057a4.48 4.48 0 003.593 4.393 4.48 4.48 0 01-2.026.077 4.482 4.482 0 004.185 3.112 8.985 8.985 0 01-5.566 1.918A9.13 9.13 0 012 19.539a12.685 12.685 0 006.88 2.017c8.256 0 12.777-6.84 12.777-12.776 0-.195-.004-.389-.013-.582A9.132 9.132 0 0022.46 6z"/></svg> },
        { name: 'Facebook', username: user.facebook, url: `https://facebook.com/${user.facebook}`, color: 'text-blue-700', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z"/></svg> },
        { name: 'LinkedIn', username: user.linkedin, url: `https://linkedin.com/in/${user.linkedin}`, color: 'text-blue-600', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.983 3.5C3.877 3.5 3 4.377 3 5.483c0 1.105.877 1.982 1.983 1.982s1.983-.877 1.983-1.982c0-1.106-.877-1.983-1.983-1.983zM3.5 21h3V9h-3v12zm5.5 0h3v-5.5c0-.87.705-1.5 1.5-1.5s1.5.63 1.5 1.5V21h3v-6c0-2.21-1.79-4-4-4s-3 1.79-3 4v6z"/></svg> },
        { name: 'GitHub', username: user.github, url: `https://github.com/${user.github}`, color: 'text-gray-900', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.648.5.5 5.648.5 12.001c0 5.104 3.292 9.429 7.87 10.958.575.107.786-.25.786-.556 0-.274-.01-1.002-.015-1.965-3.2.696-3.878-1.542-3.878-1.542-.523-1.331-1.276-1.686-1.276-1.686-1.043-.713.079-.699.079-.699 1.15.08 1.755 1.182 1.755 1.182 1.026 1.757 2.694 1.25 3.35.956.104-.744.402-1.25.73-1.539-2.552-.291-5.238-1.276-5.238-5.676 0-1.253.447-2.277 1.18-3.078-.118-.29-.511-1.459.112-3.042 0 0 .96-.306 3.142 1.175a10.942 10.942 0 012.86-.385c.97.005 1.948.131 2.86.385 2.181-1.481 3.14-1.175 3.14-1.175.625 1.583.232 2.752.114 3.042.736.801 1.178 1.825 1.178 3.078 0 4.41-2.69 5.382-5.252 5.667.413.357.78 1.059.78 2.135 0 1.54-.014 2.78-.014 3.16 0 .309.207.669.792.555A10.503 10.503 0 0023.5 12C23.5 5.648 18.352.5 12 .5z"/></svg> },
        { name: 'TikTok', username: user.tiktok, url: `https://tiktok.com/@${user.tiktok}`, color: 'text-black', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2v16.95a4.05 4.05 0 1 1-4.05-4.05h.2a2.85 2.85 0 1 0 2.85-2.85V2h1zm7.25 3.14a4.9 4.9 0 0 1-2.95-.95 4.8 4.8 0 0 1-1.8-2.19h-2.25v14.17a2.85 2.85 0 1 0 2.85 2.85V9.53a6.9 6.9 0 0 0 4.15 1.45V5.14z"/></svg> },
        { name: 'Snapchat', username: user.snapchat, url: `https://snapchat.com/add/${user.snapchat}`, color: 'text-yellow-500', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-3.278 0-6.25 2.003-6.25 5.25 0 2.455 2.082 4.25 4.625 4.25a.75.75 0 0 1 0 1.5c-1.806 0-3.354 1.21-3.354 2.75 0 1.327 1.012 2.25 2.354 2.25H14.5c1.342 0 2.354-.923 2.354-2.25 0-1.54-1.548-2.75-3.354-2.75a.75.75 0 0 1 0-1.5c2.543 0 4.625-1.795 4.625-4.25C18.25 4.003 15.278 2 12 2z"/></svg> },
        { name: 'YouTube', username: user.youtube, url: `https://youtube.com/@${user.youtube}`, color: 'text-red-600', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6zm10.5-9h-17C2.12 6 1 7.12 1 8.5v7C1 17.88 2.12 19 3.5 19h17c1.38 0 2.5-1.12 2.5-2.5v-7C23 7.12 21.88 6 20.5 6z"/></svg> },
        { name: 'Pinterest', username: user.pinterest, url: `https://pinterest.com/${user.pinterest}`, color: 'text-red-500', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12a9.99 9.99 0 0 0 6.262 9.251c-.088-.787-.167-2.008.034-2.874.182-.79 1.172-5.027 1.172-5.027s-.298-.597-.298-1.48c0-1.387.805-2.423 1.807-2.423.853 0 1.265.64 1.265 1.406 0 .856-.545 2.135-.825 3.321-.236 1 .501 1.813 1.486 1.813 1.784 0 3.157-1.88 3.157-4.594 0-2.404-1.729-4.089-4.2-4.089-2.857 0-4.538 2.143-4.538 4.362 0 .865.332 1.794.748 2.297a.3.3 0 0 1 .07.288c-.076.317-.244 1.007-.276 1.147-.043.182-.14.222-.323.134-1.207-.564-1.963-2.332-1.963-3.754 0-3.055 2.222-5.864 6.411-5.864 3.364 0 5.974 2.4 5.974 5.604 0 3.337-2.104 6.026-5.024 6.026-1.015 0-1.97-.528-2.295-1.147l-.624 2.374c-.225.864-.836 1.948-1.244 2.607.938.29 1.934.447 2.965.447 5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg> },
        { name: 'WhatsApp', username: user.whatsapp, url: `https://wa.me/${user.whatsapp}`, color: 'text-green-500', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 2.002C6.478 2.002 2 6.479 2 12.002c0 1.875.506 3.635 1.39 5.15L2 22l4.992-1.39a9.94 9.94 0 005.01 1.295c5.522 0 10-4.477 10-9.998 0-5.524-4.478-10-10-10zM6.305 17.2l-.31.09.06-.3.17-.91-.04-.07a7.93 7.93 0 01-1.195-4.008c0-4.412 3.587-8 8-8 4.414 0 8 3.588 8 8 0 4.413-3.586 8-8 8a7.9 7.9 0 01-3.87-1.02l-.075-.04-.91.24z"/></svg> },
        { name: 'Telegram', username: user.telegram, url: `https://t.me/${user.telegram}`, color: 'text-blue-400', svg: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.997 15.708l-.41 3.62c.586 0 .835-.254 1.144-.558l2.74-2.593 5.683 4.142c1.042.58 1.777.278 2.03-.962l3.683-17.143c.344-1.548-.554-2.152-1.57-1.789L.79 9.25c-1.507.572-1.49 1.383-.27 1.76l5.3 1.653 12.305-7.735c.578-.377 1.1-.17.668.24z"/></svg> },
    ];

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Social Links</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 text-gray-600">
                {links.map(link =>
                    link.username && (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex flex-col items-center hover:${link.color}`}
                        >
                            {link.svg}
                            <span className="text-xs mt-1">{link.name}</span>
                        </a>
                    )
                )}
            </div>
        </div>
    );
}
