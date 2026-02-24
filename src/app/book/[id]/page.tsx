"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, MessageSquare, Heart, Share2, ArrowRight } from 'lucide-react';
import { Book, Review } from '@/types';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function BookPreview() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');

  const { data: book, isLoading: bookLoading } = useQuery<Book>({
    queryKey: ['book', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) throw new Error('Failed to fetch book');
      return res.json();
    },
    enabled: !!id
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ['reviews', id],
    queryFn: async () => {
      if (!id) return [];
      const res = await fetch(`/api/reviews/${id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!id
  });

  const reviewMutation = useMutation({
    mutationFn: async (newReview: any) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      toast.success('Review posted!');
      setComment('');
    }
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book?.title,
          text: book?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddToLibrary = () => {
    if (!user) {
      toast.error('Please login to save books');
      return;
    }
    toast.success('Added to your library!');
  };

  const handleUnlock = () => {
    if (!user) {
      toast.error('Please login to unlock full books');
      return;
    }
    toast.loading('Redirecting to secure checkout...', { duration: 2000 });
    setTimeout(() => {
      toast.success('This feature is coming soon! Support pen.in by sharing.');
    }, 2000);
  };

  if (bookLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!book) return <div className="h-screen flex items-center justify-center">Book not found</div>;

  return (
    <div className="min-h-screen bg-transparent pb-20">
      {/* Header */}
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-b border-black/5 dark:border-white/10 py-24">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-64 aspect-[2/3] rounded-2xl shadow-xl overflow-hidden flex-shrink-0">
            <img 
              src={book.cover_image || `https://picsum.photos/seed/${book.title}/600/900`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#991b1b]/10 text-[#991b1b] dark:text-[#f87171] text-xs font-bold rounded-full uppercase tracking-wider">
                {book.genre}
              </span>
              <div className="flex items-center gap-1 text-[#991b1b] dark:text-[#f87171]">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">4.8 (124 ratings)</span>
              </div>
            </div>
            <h1 className="text-5xl font-serif font-bold mb-4 leading-tight dark:text-white">{book.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <span className="text-gray-600 dark:text-gray-400">by <Link href="#" className="font-bold hover:underline dark:text-white">{book.author_name}</Link></span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-2xl">
              {book.description || "No description provided."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => document.getElementById('preview-content')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-8 py-3 flex items-center gap-2"
              >
                Start Reading Preview
              </button>
              <button 
                onClick={handleAddToLibrary}
                className="btn-secondary px-8 py-3 flex items-center gap-2 bg-white dark:bg-zinc-800 dark:text-white border-black/5 dark:border-white/10"
              >
                <Heart className="w-4 h-4" />
                Add to Library
              </button>
              <button 
                onClick={handleShare}
                className="p-3 border border-black/5 dark:border-white/10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors dark:text-white"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div id="preview-content" className="prose prose-lg font-serif leading-relaxed text-gray-800 dark:text-gray-200 mb-12">
          <div dangerouslySetInnerHTML={{ __html: book.preview_content }} />
        </div>

        {/* Paywall Tease */}
        <div className="relative py-20 text-center border-t border-black/5 dark:border-white/10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfcfb] dark:from-neutral-950 via-[#fdfcfb]/80 dark:via-neutral-950/80 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl font-serif font-bold mb-4 dark:text-white">Enjoying the story?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You've reached the end of the free preview. Unlock the full book to continue reading {book.author_name}'s masterpiece.
            </p>
            <button 
              onClick={handleUnlock}
              className="btn-primary px-10 py-4 text-lg shadow-lg shadow-[#991b1b]/20"
            >
              Unlock Full Book
            </button>
            <p className="mt-4 text-xs text-gray-400">Support independent writers directly.</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-20 border-t border-black/5 dark:border-white/10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-serif font-bold dark:text-white">Reader Reviews</h2>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{reviews?.length || 0} reviews</span>
            </div>
          </div>

          {user && (
            <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-black/5 dark:border-white/10 p-6 mb-12 shadow-sm">
              <h4 className="font-bold mb-4 dark:text-white">Write a review</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star className={`w-6 h-6 ${s <= rating ? 'fill-[#991b1b] text-[#991b1b] dark:fill-[#f87171] dark:text-[#f87171]' : 'text-gray-200 dark:text-zinc-800'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[#f9f8f6] dark:bg-zinc-800/50 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none resize-none mb-4 dark:text-white"
                rows={3}
                placeholder="What did you think of the preview?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                onClick={() => reviewMutation.mutate({ book_id: book.id, user_id: user.id, rating, comment })}
                disabled={reviewMutation.isPending}
                className="btn-primary text-sm"
              >
                Post Review
              </button>
            </div>
          )}

          <div className="space-y-8">
            {reviews?.map(review => (
              <div key={review.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm dark:text-white">{review.username}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#991b1b] text-[#991b1b] dark:fill-[#f87171] dark:text-[#f87171]' : 'text-gray-200 dark:text-zinc-800'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
