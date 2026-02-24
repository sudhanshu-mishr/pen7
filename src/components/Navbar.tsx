import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, PenTool, Search } from 'lucide-react';
import { useAuthStore } from '../store';
import { toast } from 'react-hot-toast';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = () => {
    toast.success('Search feature is being indexed...');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fdfcfb]/80 backdrop-blur-md border-bottom border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-[#5A5A40]">pen.in</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-[#5A5A40]">Discover</Link>
            <Link to="/genres" className="text-sm font-medium hover:text-[#5A5A40]">Genres</Link>
            <Link to="/trending" className="text-sm font-medium hover:text-[#5A5A40]">Trending</Link>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleSearch}
              className="p-2 hover:bg-black/5 rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/write" className="btn-primary flex items-center gap-2 text-sm">
                  <PenTool className="w-4 h-4" />
                  Write
                </Link>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-[#5A5A40]/10 flex items-center justify-center border border-[#5A5A40]/20">
                    <User className="w-5 h-5 text-[#5A5A40]" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-2 hidden group-hover:block">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-black/5">Dashboard</Link>
                    <Link to={`/profile/${user.username}`} className="block px-4 py-2 text-sm hover:bg-black/5">Profile</Link>
                    <hr className="my-1 border-black/5" />
                    <button 
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium px-4 py-2 hover:text-[#5A5A40]">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Join Free</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
