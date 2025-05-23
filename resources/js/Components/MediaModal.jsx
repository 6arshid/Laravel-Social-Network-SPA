import React, { useEffect } from 'react';

export default function MediaModal({ media, index, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // ✅ If index is null/undefined OR media[index] not valid
  if (index === null || index === undefined || !media || !media[index]) return null;

  const current = media[index];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="relative max-w-5xl w-full max-h-[90vh] p-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-3xl">&times;</button>

        {current.type === 'image' ? (
          <img src={`/storage/${current.file_path}`} className="w-full max-h-[80vh] object-contain rounded" />
        ) : (
          <video controls autoPlay className="w-full max-h-[80vh] rounded">
            <source src={`/storage/${current.file_path}`} type="video/mp4" />
          </video>
        )}

        {/* Slider arrows */}
        <div className="absolute top-1/2 left-2 text-white text-3xl cursor-pointer" onClick={() => onClose((index - 1 + media.length) % media.length)}>&#10094;</div>
        <div className="absolute top-1/2 right-2 text-white text-3xl cursor-pointer" onClick={() => onClose((index + 1) % media.length)}>&#10095;</div>
      </div>
    </div>
  );
}
