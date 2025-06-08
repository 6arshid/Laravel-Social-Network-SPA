import React, { useCallback, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useDropzone } from 'react-dropzone';

export default function PostForm({ post = null, action = null }) {
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
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(action ?? (post ? `/posts/${post.id}` : '/posts'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <textarea
        value={data.content}
        onChange={(e) => setData('content', e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.content && <div className="text-red-500 text-sm">{errors.content}</div>}

      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Click or drag files to upload</p>
        )}
      </div>
      {errors.media && <div className="text-red-500 text-sm">{errors.media}</div>}

      <button
        type="submit"
        disabled={processing}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
      >
        {post ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
