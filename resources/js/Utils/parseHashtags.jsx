import React from 'react';
import { Link } from '@inertiajs/react';

export default function parseHashtags(text) {
  const regex = /(#\S+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (regex.test(part)) {
      const tag = part.slice(1);
      return (
        <Link
          key={i}
          href={`/hashtag/${encodeURIComponent(tag)}`}
          className="text-blue-600 hover:underline"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
