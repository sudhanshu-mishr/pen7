"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../store';
import { PenTool, Sun, Moon } from 'lucide-react';
import { ProfileDropdown } from './profile-dropdown';

const AnimatedNavLink = ({ to, children }: { to: string; children: React.ReactNode; key?: string }) => {
  const defaultTextColor = 'text-gray-600 dark:text-gray-400';
  const hoverTextColor = 'text-[#991b1b] dark:text-[#f87171]';
  const textSizeClass = 'text-sm font-medium';

  return (
    <Link to={to} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

export function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const themeToggle = (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );

  const logoElement = (
    <Link to="/" className="relative w-6 h-6 flex items-center justify-center">
      <span className="absolute w-2 h-2 rounded-full bg-[#991b1b] dark:bg-[#f87171] top-0 left-1/2 transform -translate-x-1/2 shadow-sm"></span>
      <span className="absolute w-2 h-2 rounded-full bg-[#991b1b] dark:bg-[#f87171] left-0 top-1/2 transform -translate-y-1/2 shadow-sm"></span>
      <span className="absolute w-2 h-2 rounded-full bg-[#991b1b] dark:bg-[#f87171] right-0 top-1/2 transform -translate-y-1/2 shadow-sm"></span>
      <span className="absolute w-2 h-2 rounded-full bg-[#991b1b] dark:bg-[#f87171] bottom-0 left-1/2 transform -translate-x-1/2 shadow-sm"></span>
    </Link>
  );

  const navLinksData = [
    { label: 'Discover', href: '/' },
    { label: 'Genres', href: '/genres' },
    { label: 'Trending', href: '/trending' },
  ];

  const authButtons = user ? (
    <div className="flex items-center gap-3">
      <Link to="/write" className="hidden sm:flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-[#991b1b] rounded-full hover:bg-[#7f1d1d] shadow-sm transition-all active:scale-95">
        <PenTool className="w-3 h-3" />
        Write
      </Link>
      <ProfileDropdown />
    </div>
  ) : (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link to="/login" className="px-4 py-2 sm:px-3 text-xs sm:text-sm font-medium border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 text-gray-700 dark:text-gray-200 rounded-full hover:border-[#991b1b] dark:hover:border-[#f87171] hover:text-[#991b1b] dark:hover:text-[#f87171] transition-all duration-200 w-full sm:w-auto text-center">
        LogIn
      </Link>
      <div className="relative group w-full sm:w-auto">
         <div className="absolute inset-0 -m-2 rounded-full
                       hidden sm:block
                       bg-[#991b1b] dark:bg-[#f87171]
                       opacity-10 dark:opacity-20 filter blur-lg pointer-events-none
                       transition-all duration-300 ease-out
                       group-hover:opacity-30 dark:group-hover:opacity-40 group-hover:blur-xl group-hover:-m-3"></div>
         <Link to="/register" className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-[#991b1b] to-[#7f1d1d] dark:from-[#f87171] dark:to-[#ef4444] rounded-full hover:shadow-lg transition-all duration-200 w-full sm:w-auto block text-center">
           Join Free
         </Link>
      </div>
    </div>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100]
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-md
                       ${headerShapeClass}
                       border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#1f1f1f]/80
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius,background-color] duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
           {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} to={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-4 sm:gap-6">
          {themeToggle}
          <div className="flex items-center gap-2 sm:gap-3">
            {authButtons}
          </div>
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors w-full text-center">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {themeToggle}
          {authButtons}
        </div>
      </div>
    </header>
  );
}
