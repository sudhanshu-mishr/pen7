import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link to={`/book/${book.id}`} className="book-card group">
      <div className="aspect-[2/3] relative overflow-hidden bg-[#f5f5f0] dark:bg-zinc-800">
        {book.cover_image ? (
          <img 
            src={book.cover_image} 
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <span className="text-xs uppercase tracking-widest text-[#991b1b]/40 dark:text-white/20 mb-2">{book.genre}</span>
            <h3 className="font-serif text-xl font-bold text-[#991b1b] dark:text-[#f87171] leading-tight">{book.title}</h3>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#991b1b]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white text-xs font-medium">Read Preview</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-wider text-[#991b1b] dark:text-[#f87171] font-semibold">{book.genre}</span>
          <div className="flex items-center gap-1 text-[#991b1b] dark:text-[#f87171]">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{book.rating_avg || '4.8'}</span>
          </div>
        </div>
        <h3 className="font-serif text-lg font-bold mb-1 line-clamp-1 dark:text-white">{book.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">by {book.author_name}</p>
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span className="text-[10px]">{book.review_count || 0} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
