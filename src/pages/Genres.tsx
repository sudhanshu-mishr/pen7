import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookCard } from '../components/BookCard';
import { Book } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

import { BentoCard, BentoGrid } from '../components/ui/bento-grid';
import { Heart, Sparkles, Rocket, Search, Flame, BookOpen } from 'lucide-react';

const GENRES = [
  { 
    name: 'Romance', 
    Icon: Heart, 
    description: 'Love stories that pull at the heartstrings.',
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 bg-rose-50 dark:bg-rose-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&h=600&fit=crop&q=80" alt="Romance" />
  },
  { 
    name: 'Fantasy', 
    Icon: Sparkles, 
    description: 'Epic journeys through magical realms.',
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 bg-purple-50 dark:bg-purple-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop&q=80" alt="Fantasy" />
  },
  { 
    name: 'Sci-Fi', 
    Icon: Rocket, 
    description: 'Exploring the future and beyond.',
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3 bg-blue-50 dark:bg-blue-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop&q=80" alt="Sci-Fi" />
  },
  { 
    name: 'Mystery', 
    Icon: Search, 
    description: 'Puzzles that keep you guessing.',
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-4 bg-amber-50 dark:bg-amber-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&h=600&fit=crop&q=80" alt="Mystery" />
  },
  { 
    name: 'Thriller', 
    Icon: Flame, 
    description: 'High-stakes suspense and action.',
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 bg-red-50 dark:bg-red-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop&q=80" alt="Thriller" />
  },
  { 
    name: 'Non-Fiction', 
    Icon: BookOpen, 
    description: 'Real stories and knowledge.',
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4 bg-emerald-50 dark:bg-emerald-950/20",
    background: <img className="absolute -right-10 -top-10 opacity-40 dark:opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&q=80" alt="Non-Fiction" />
  },
];

export const Genres = () => {
  const [selectedGenre, setSelectedGenre] = React.useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await fetch('/api/books');
      return res.json();
    }
  });

  const filteredBooks = books?.filter(b => !selectedGenre || b.genre === selectedGenre);

  const handleGenreSelect = (genreName: string) => {
    const isDeselecting = selectedGenre === genreName;
    setSelectedGenre(isDeselecting ? null : genreName);
    
    if (!isDeselecting) {
      // Small timeout to allow the results section to render before scrolling
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold mb-4 dark:text-white">Browse by Genre</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Explore our curated collections across every literary landscape. From the depths of space to the heights of romance.
          </p>
        </div>

        {/* Genre Grid */}
        <BentoGrid className="lg:grid-rows-3 mb-16">
          {GENRES.map((genre) => (
            <BentoCard 
              key={genre.name} 
              name={genre.name}
              className={cn(
                genre.className,
                selectedGenre === genre.name && "ring-2 ring-[#991b1b]"
              )}
              background={genre.background}
              Icon={genre.Icon}
              description={genre.description}
              cta={selectedGenre === genre.name ? "Selected" : "Browse Genre"}
              href="#"
              onClick={() => handleGenreSelect(genre.name)}
            />
          ))}
        </BentoGrid>

        {/* Results */}
        <div ref={resultsRef} className="scroll-mt-32">
          {selectedGenre && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold dark:text-white">
                  {selectedGenre} Previews
                </h2>
                <button 
                  onClick={() => setSelectedGenre(null)}
                  className="text-sm font-bold text-[#991b1b] dark:text-[#f87171] hover:underline"
                >
                  Clear Filter
                </button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredBooks?.length === 0 ? (
                <div className="text-center py-20 bg-black/5 rounded-3xl">
                  <p className="text-gray-500">No books found in this genre yet. Be the first to write one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {filteredBooks?.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
