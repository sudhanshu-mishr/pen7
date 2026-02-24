"use client";

import React from 'react';
import { useAuthStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { BookCard } from '@/components/BookCard';
import { Book } from '@/types';
import { PenTool, BookOpen, Star, Settings } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data: books } = useQuery<Book[]>({
    queryKey: ['my-books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      if (!res.ok) return [];
      const all: Book[] = await res.json();
      return all.filter((b: Book) => b.author_id === user?.id);
    },
    enabled: !!user
  });

  const handleSettings = () => {
    toast.success('Profile settings coming soon!');
  };

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2 dark:text-white">Welcome back, {user.username}</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your stories.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/write" className="btn-primary flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Write New Book
          </Link>
          <button 
            onClick={handleSettings}
            className="p-2 border border-black/5 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold dark:text-white">My Books</h3>
          </div>
          <p className="text-3xl font-serif font-bold dark:text-white">{books?.length || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Published works</p>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold dark:text-white">Total Reviews</h3>
          </div>
          <p className="text-3xl font-serif font-bold dark:text-white">42</p>
          <p className="text-xs text-gray-400 mt-1">Reader feedback</p>
        </div>
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold dark:text-white">Avg. Rating</h3>
          </div>
          <p className="text-3xl font-serif font-bold dark:text-white">4.9</p>
          <p className="text-xs text-gray-400 mt-1">Across all books</p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold dark:text-white">My Published Books</h2>
          <Link href="/write" className="text-sm font-bold text-[#991b1b] dark:text-[#f87171] hover:underline">View All</Link>
        </div>
        
        {books && books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/10 p-20 text-center">
            <PenTool className="w-12 h-12 text-gray-200 dark:text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2 dark:text-white">No books yet</h3>
            <p className="text-gray-400 mb-8">Start your first story and share it with the world.</p>
            <Link href="/write" className="btn-primary">Create Your First Book</Link>
          </div>
        )}
      </div>
    </div>
  );
};
