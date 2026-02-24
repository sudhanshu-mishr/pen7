import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MiniNavbar } from './components/ui/mini-navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Editor } from './pages/Editor';
import { BookPreview } from './pages/BookPreview';
import { Dashboard } from './pages/Dashboard';
import { Genres } from './pages/Genres';
import { Trending } from './pages/Trending';
import { PencilLoader } from './components/ui/loader-1';
import { BeamsBackground } from './components/ui/beams-background';
import ArtisticBackground from './components/ui/dynamic-background';
import AnoAI from './components/ui/animated-shader-background';
import ClickSpark from './components/ui/click-spark';
import { useThemeStore } from './store';

const queryClient = new QueryClient();

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const { theme } = useThemeStore();

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#fdfcfb] dark:bg-[#0a0a0a] z-[9999] flex items-center justify-center transition-colors duration-300">
        <PencilLoader />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/write" element={<Editor />} />
                <Route path="/book/:id" element={<BookPreview />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/trending" element={<Trending />} />
              </Routes>
            </main>
            <footer className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-black/5 dark:border-white/5 py-12">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm text-gray-400">© 2026 pen.in. Built for writers, loved by readers.</p>
              </div>
            </footer>
          </BeamsBackground>
        </ClickSpark>
        <Toaster position="bottom-right" />
      </Router>
    </QueryClientProvider>
  );
}
