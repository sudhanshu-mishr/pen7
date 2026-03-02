import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookCard } from '../components/BookCard';
import { Book } from '../types';
import { motion } from 'motion/react';
import ElegantCarousel from '../components/ui/elegant-carousel';
import { CTASection } from '../components/ui/hero-dithering-card';
import { PublishingTimeline } from '../components/PublishingTimeline';
import MountainVistaParallax from '../components/ui/mountain-vista-bg';
import { useAuthStore } from '../store';
import { PenTool, BookOpen, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const GENRES = ['All', 'Romance', 'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Non-Fiction'];

export const Home = () => {
  const { user } = useAuthStore();
  const [selectedGenre, setSelectedGenre] = React.useState('All');

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      return res.json();
    }
  });

  const { data: myBooks } = useQuery<Book[]>({
    queryKey: ['my-books', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/books');
      const all = await res.json();
      return all.filter((b: Book) => b.author_id === user?.id);
    },
    enabled: !!user
  });

  const filteredBooks = books?.filter(b => selectedGenre === 'All' || b.genre === selectedGenre);

  if (user) {
    return (
      <div className="min-h-screen pb-20 bg-transparent pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Welcome Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6"
          >
            <div>
              <h1 className="text-5xl font-serif font-bold mb-2 dark:text-white">Welcome back, {user.username}</h1>
              <p className="text-gray-500 dark:text-gray-400">Ready to continue your story?</p>
            </div>
            <Link to="/write" className="btn-primary flex items-center gap-2 shadow-xl shadow-[#991b1b]/20 hover:scale-105 transition-transform">
              <PenTool className="w-4 h-4" />
              Write New Book
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold dark:text-white">My Library</h3>
              </div>
              <p className="text-4xl font-serif font-bold dark:text-white">{myBooks?.length || 0}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Published works</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-bold dark:text-white">Reader Score</h3>
              </div>
              <p className="text-4xl font-serif font-bold dark:text-white">4.9</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Avg. Rating</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-[2rem] border border-black/5 dark:border-white/10 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold dark:text-white">Engagement</h3>
              </div>
              <p className="text-4xl font-serif font-bold dark:text-white">1.2k</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Total Views</p>
            </motion.div>
          </div>

          {/* My Recent Books */}
          {myBooks && myBooks.length > 0 && (
            <div className="mb-20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif font-bold dark:text-white">Your Recent Works</h2>
                <Link to="/dashboard" className="text-sm font-bold text-[#991b1b] dark:text-[#f87171] hover:underline uppercase tracking-widest">Full Dashboard</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {myBooks.slice(0, 5).map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          )}

          {/* Discovery Section (Always relevant) */}
          <div className="pt-12 border-t border-black/5 dark:border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-bold mb-2 dark:text-white">Discover New Previews</h2>
                <p className="text-gray-500 dark:text-gray-400">Explore what the community is writing.</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      selectedGenre === genre 
                        ? 'bg-[#991b1b] text-white shadow-md' 
                        : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#991b1b] dark:hover:border-[#f87171]'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-100/50 dark:bg-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredBooks?.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-20">
          <MountainVistaParallax 
            title="Your Writing Journey" 
            subtitle="From the first word to the final chapter, we're with you every step of the way."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-transparent">
      {/* Hero Section */}
      <div className="pt-6">
        <ElegantCarousel />
      </div>

      <div className="mt-20">
        <MountainVistaParallax 
          title="The Writer's Vista" 
          subtitle="Discover breathtaking stories and start your own adventure today."
        />
      </div>

      {/* Publishing Steps Timeline */}
      <PublishingTimeline />

      {/* Discovery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-2 dark:text-white">Discover Previews</h2>
            <p className="text-gray-500 dark:text-gray-400">The first 10 pages of tomorrow's bestsellers.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedGenre === genre 
                    ? 'bg-[#991b1b] text-white shadow-md' 
                    : 'bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#991b1b] dark:hover:border-[#f87171]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredBooks?.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      <CTASection />
    </div>
  );
};
