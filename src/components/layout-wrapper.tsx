"use client";

import React, { useEffect, useState } from 'react';
import { MiniNavbar } from './ui/mini-navbar';
import { PencilLoader } from './ui/loader-1';
import { BeamsBackground } from './ui/beams-background';
import ArtisticBackground from './ui/dynamic-background';
import AnoAI from './ui/animated-shader-background';
import ClickSpark from './ui/click-spark';
import { useThemeStore, useAuthStore } from '../store';
import { Toaster } from 'react-hot-toast';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();
  const { setUser } = useAuthStore();

  // Handle theme application
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Handle initial loading and session restoration
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) { // Check if user object is returned
             setUser(data);
          }
        }
      } catch (e) {
        // Session check failed, user remains logged out
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    checkSession();
  }, [setUser]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#fdfcfb] dark:bg-[#0a0a0a] z-[9999] flex items-center justify-center transition-colors duration-300">
        <PencilLoader />
      </div>
    );
  }

  return (
    <>
      <ClickSpark
        sparkColor='#991b1b'
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <AnoAI />
        <ArtisticBackground />
        <BeamsBackground className="min-h-screen flex flex-col bg-transparent dark:bg-transparent" intensity="subtle">
          <MiniNavbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-black/5 dark:border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-gray-400">© 2026 pen.in. Built for writers, loved by readers.</p>
            </div>
          </footer>
        </BeamsBackground>
      </ClickSpark>
      <Toaster position="bottom-right" />
    </>
  );
}
