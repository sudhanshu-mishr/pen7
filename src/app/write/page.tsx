"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function Editor() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [genre, setGenre] = React.useState('Romance');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handleSaveDraft = () => {
    if (!title && !content) {
      toast.error('Nothing to save!');
      return;
    }
    toast.success('Draft saved locally');
    localStorage.setItem('penin_draft', JSON.stringify({ title, genre, description, content }));
  };

  const handleLoginToPublish = () => {
    handleSaveDraft();
    toast('Please login to publish your story', { icon: '✍️' });
    router.push('/login');
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('penin_draft');
    if (saved) {
      const { title, genre, description, content } = JSON.parse(saved);
      setTitle(title || '');
      setGenre(genre || 'Romance');
      setDescription(description || '');
      setContent(content || '');
      toast.success('Restored draft from last session');
    }
  }, []);

  const handlePublish = async () => {
    if (!user) {
      handleLoginToPublish();
      return;
    }
    if (!title || !content) {
      toast.error('Please add a title and some content');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: user.id,
          title,
          genre,
          description,
          content,
          cover_image: `https://picsum.photos/seed/${title}/600/900` // Mock cover
        })
      });

      if (res.ok) {
        toast.success('Book published successfully!');
        router.push('/dashboard');
      } else {
        toast.error('Failed to publish');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsPublishing(false);
    }
  };

  const wordCount = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-black dark:hover:text-white">Cancel</button>
            <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
            <span className="text-sm font-medium text-gray-400">
              {wordCount} words
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveDraft}
              className="btn-secondary flex items-center gap-2 text-sm bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm border-black/5 dark:border-white/10"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            {user ? (
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-[#991b1b]/20"
              >
                <Upload className="w-4 h-4" />
                {isPublishing ? 'Publishing...' : 'Publish Preview'}
              </button>
            ) : (
              <button 
                onClick={handleLoginToPublish}
                className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-[#991b1b]/20"
              >
                <Upload className="w-4 h-4" />
                Login to Publish
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <input 
              type="text" 
              placeholder="Title of your masterpiece..."
              className="w-full text-5xl font-serif font-bold bg-transparent border-none outline-none placeholder:text-gray-300 dark:placeholder:text-zinc-800 dark:text-white transition-all focus:placeholder:text-gray-200 dark:focus:placeholder:text-zinc-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 min-h-[600px] shadow-xl overflow-hidden transition-all duration-500">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent}
                placeholder="Start writing your story here..."
                className="h-[550px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-xl">
              <h3 className="font-serif text-xl font-bold mb-4 dark:text-white">Book Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Genre</label>
                  <select 
                    className="w-full bg-[#f9f8f6] dark:bg-zinc-800/50 border border-black/5 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none dark:text-white transition-all focus:ring-2 ring-[#991b1b]/20"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  >
                    <option>Romance</option>
                    <option>Fantasy</option>
                    <option>Sci-Fi</option>
                    <option>Mystery</option>
                    <option>Thriller</option>
                    <option>Non-Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-[#f9f8f6] dark:bg-zinc-800/50 border border-black/5 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none resize-none dark:text-white transition-all focus:ring-2 ring-[#991b1b]/20"
                    placeholder="What's your story about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Cover Image</label>
                  <div className="aspect-[2/3] bg-[#f9f8f6] dark:bg-zinc-800/50 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#991b1b]/30 transition-all group">
                    <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2 group-hover:text-[#991b1b] transition-colors" />
                    <span className="text-xs text-gray-400 group-hover:text-[#991b1b] transition-colors">Upload Cover</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#991b1b]/5 dark:bg-[#991b1b]/10 rounded-2xl p-6 border border-[#991b1b]/10 dark:border-[#991b1b]/20">
              <h4 className="font-bold text-sm mb-2 text-[#991b1b] dark:text-[#f87171]">Preview Mode</h4>
              <p className="text-xs text-[#991b1b]/70 dark:text-[#f87171]/70 leading-relaxed">
                pen.in automatically makes the first 10 pages (approx. 3,000 words) available for free. The rest will be locked until you enable monetization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
