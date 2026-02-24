import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookCard } from '../components/BookCard';
import { Book } from '../types';
import { TrendingUp, Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import EnergyBeam from '../components/ui/energy-beam';

export const Trending = () => {
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      return res.json();
    }
  });

  // Sort by rating_avg * review_count for a simple "trending" score
  const trendingBooks = books
    ?.map(b => ({
      ...b,
      score: (b.rating_avg || 0) * (b.review_count || 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Energy Beam */}
      <div className="absolute inset-0 z-0 opacity-50">
        <EnergyBeam />
      </div>

      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-[#991b1b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#991b1b]/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-5xl font-serif font-bold text-white">Trending Now</h1>
            <p className="text-gray-400">The stories capturing everyone's imagination this week.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-zinc-900 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top 3 Featured Trending */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {trendingBooks?.slice(0, 3).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-xl z-20 flex items-center justify-center font-serif font-bold text-2xl text-[#991b1b] dark:text-[#f87171] border border-black/5 dark:border-white/10">
                    {index + 1}
                  </div>
                  <BookCard book={book} />
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-white">{book.rating_avg?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{book.review_count} reviews</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rest of Trending */}
            <div className="pt-12 border-t border-white/10">
              <h2 className="text-2xl font-serif font-bold mb-8 text-gray-500 uppercase tracking-widest text-sm">Rising Stars</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {trendingBooks?.slice(3).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
