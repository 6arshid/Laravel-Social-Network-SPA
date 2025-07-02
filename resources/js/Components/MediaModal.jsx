import React, { useEffect, useState } from 'react';

export default function MediaModal({ media, index, onClose, onNavigate }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    const handleKeyNav = (e) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };
    
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleKeyNav);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('keydown', handleKeyNav);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);
  }, [index]);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  if (index === null || index === undefined || !media || !media[index]) return null;

  const current = media[index];
  const isFirstImage = index === 0;
  const isLastImage = index === media.length - 1;

  const handlePrevious = () => {
    if (!isFirstImage) {
      const newIndex = index - 1;
      onNavigate ? onNavigate(newIndex) : onClose();
    }
  };

  const handleNext = () => {
    if (!isLastImage) {
      const newIndex = index + 1;
      onNavigate ? onNavigate(newIndex) : onClose();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Close icon SVG
  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Arrow left SVG
  const ArrowLeftIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  // Arrow right SVG
  const ArrowRightIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  // Download icon SVG
  const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  // Fullscreen icon SVG
  const FullscreenIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );

  // Play icon SVG
  const PlayIcon = () => (
    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  // Loading spinner SVG
  const LoadingSpinner = () => (
    <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 dark:bg-black/98 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
      onMouseMove={handleMouseMove}
    >
      {/* Header Controls */}
      <div className={`absolute top-0 left-0 right-0 z-10 transition-all duration-300 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg sm:text-xl font-semibold truncate max-w-xs sm:max-w-md">
                {current.name || current.title || `Media ${index + 1}`}
              </h3>
              <span className="text-sm text-gray-300 bg-black/30 px-2 py-1 rounded-full">
                {index + 1} of {media.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = `/storage/${current.file_path}`;
                  link.download = current.name || `media-${index + 1}`;
                  link.click();
                }}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200"
                title="Download"
              >
                <DownloadIcon />
              </button>
              
              {/* Fullscreen button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (current.type === 'image') {
                    const img = document.querySelector('.modal-media');
                    if (img.requestFullscreen) {
                      img.requestFullscreen();
                    }
                  }
                }}
                className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors duration-200"
                title="Fullscreen"
              >
                <FullscreenIcon />
              </button>
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/30 hover:bg-red-600/50 transition-colors duration-200"
                title="Close (Esc)"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="flex flex-col items-center justify-center text-white space-y-4">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">Failed to load media</p>
            <button 
              onClick={() => {
                setImageError(false);
                setIsLoading(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Media Content */}
        {!imageError && (
          <>
            {current.type === 'image' ? (
              <img 
                src={`/storage/${current.file_path}`}
                alt={current.name || `Media ${index + 1}`}
                className="modal-media max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: isLoading ? 'none' : 'block' }}
              />
            ) : (
              <div className="relative max-w-full max-h-full">
                <video 
                  controls 
                  autoPlay 
                  className="modal-media max-w-full max-h-full rounded-lg shadow-2xl"
                  onLoadStart={() => setIsLoading(false)}
                  onError={handleImageError}
                  style={{ display: isLoading ? 'none' : 'block' }}
                >
                  <source src={`/storage/${current.file_path}`} type="video/mp4" />
                  <source src={`/storage/${current.file_path}`} type="video/webm" />
                  <source src={`/storage/${current.file_path}`} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
                {/* Custom play button overlay for video */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-white/80">
                    <PlayIcon />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            {/* Previous Button */}
            {!isFirstImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className={`absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 ${
                  showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                }`}
                title="Previous (←)"
              >
                <ArrowLeftIcon />
              </button>
            )}

            {/* Next Button */}
            {!isLastImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 ${
                  showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
                title="Next (→)"
              >
                <ArrowRightIcon />
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <div className="bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {current.type === 'image' ? 'Image' : 'Video'}
              </span>
              {current.size && (
                <span className="text-gray-300">
                  {(current.size / 1024 / 1024).toFixed(1)} MB
                </span>
              )}
              {current.dimensions && (
                <span className="text-gray-300">
                  {current.dimensions}
                </span>
              )}
            </div>
            
            <div className="hidden sm:flex items-center space-x-6 text-gray-300">
              <span>Press ESC to close</span>
              <span>Use ← → to navigate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className={`absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}>
          <div className="flex space-x-2 bg-black/50 rounded-lg p-2 max-w-xs sm:max-w-md overflow-x-auto">
            {media.slice(Math.max(0, index - 2), Math.min(media.length, index + 3)).map((item, idx) => {
              const actualIndex = Math.max(0, index - 2) + idx;
              return (
                <button
                  key={actualIndex}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate ? onNavigate(actualIndex) : onClose();
                  }}
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                    actualIndex === index 
                      ? 'ring-2 ring-blue-500 scale-110' 
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img 
                      src={`/storage/${item.file_path}`} 
                      alt={`Thumbnail ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <PlayIcon />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}