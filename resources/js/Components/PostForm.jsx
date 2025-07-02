import React, { useCallback, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function PostForm({ post = null, action = null }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { data, setData, post: submit, processing, errors } = useForm({
    content: post?.content || '',
    media: [],
  });

  const onDrop = useCallback((acceptedFiles) => {
    setData('media', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.wmv'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.doc', '.docx']
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(action ?? (post ? `/posts/${post.id}` : '/posts'));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const removeFile = (index) => {
    const newFiles = data.media.filter((_, i) => i !== index);
    setData('media', newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {post ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Share your thoughts with the world
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Main Form */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Content Textarea */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                What's on your mind?
              </label>
              <div className="relative">
                <textarea
                  value={data.content}
                  onChange={(e) => setData('content', e.target.value)}
                  placeholder="Share your thoughts, ideas, or experiences..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } ${errors.content ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <div className={`absolute bottom-3 right-3 text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {data.content.length}/1000
                </div>
              </div>
              {errors.content && (
                <div className="mt-2 flex items-center text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.content}
                </div>
              )}
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Attachments
              </label>
              <div
                {...getRootProps()}
                className={`relative p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDarkMode
                    ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <svg
                    className={`mx-auto h-12 w-12 mb-4 ${
                      isDragActive
                        ? 'text-blue-500'
                        : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-400'
                    }`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H8a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className={`text-lg font-medium ${
                    isDragActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : isDarkMode
                      ? 'text-gray-200'
                      : 'text-gray-900'
                  }`}>
                    {isDragActive ? 'Drop files here' : 'Upload files'}
                  </p>
                  <p className={`mt-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Drag and drop files here, or click to browse
                  </p>
                  <p className={`mt-1 text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Supports images, videos, documents (Max 10MB each)
                  </p>
                </div>
              </div>
              {errors.media && (
                <div className="mt-2 flex items-center text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.media}
                </div>
              )}
            </div>

            {/* Uploaded Files Preview */}
            {data.media.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Uploaded Files ({data.media.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.media.map((file, index) => (
                    <div
                      key={index}
                      className={`relative p-3 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            {file.name}
                          </p>
                          <p className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/20 ${
                            isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={processing}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {processing ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Publishing...</span>
                  </div>
                ) : (
                  <span>{post ? 'Update Post' : 'Publish Post'}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className={`mt-8 p-6 rounded-xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-800'
          }`}>
            💡 Tips for Better Posts
          </h3>
          <ul className={`space-y-2 text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-blue-700'
          }`}>
            <li>• Use clear and engaging headlines to capture attention</li>
            <li>• Add relevant images or videos to make your post more visual</li>
            <li>• Keep your content concise but informative</li>
            <li>• Use hashtags to increase discoverability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}