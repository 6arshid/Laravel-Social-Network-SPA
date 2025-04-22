import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function PostForm({ post = null }) {
  const { data, setData, post: submit, processing, errors } = useForm({
    content: post?.content || '',
    media: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(post ? `/posts/${post.id}` : '/posts');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={data.content}
        onChange={(e) => setData('content', e.target.value)}
        placeholder="Benvisid..."
        className="w-full border p-2"
      />
      {errors.content && <div className="text-red-500">{errors.content}</div>}

      <input
        type="file"
        multiple
        onChange={(e) => setData('media', e.target.files)}
      />
      {errors.media && <div className="text-red-500">{errors.media}</div>}

      <button disabled={processing} className="bg-blue-500 text-white px-4 py-2 rounded">
        {post ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
