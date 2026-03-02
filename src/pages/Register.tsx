import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { CloudWatchFace } from '../components/CloudWatchFace';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success('Account created!');
        navigate('/');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 p-8 md:p-12 transition-all duration-500"
      >
        <CloudWatchFace isTyping={isTyping} />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold mb-3 dark:text-white tracking-tight">Join pen.in</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Start your journey as a reader or writer today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Username</Label>
            <Input 
              type="text" 
              required
              placeholder="bookworm123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#f9f8f6]/50 dark:bg-zinc-800/30 border-black/5 dark:border-white/5 h-12 rounded-2xl focus:ring-[#5A5A40]/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Email Address</Label>
            <Input 
              type="email" 
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#f9f8f6]/50 dark:bg-zinc-800/30 border-black/5 dark:border-white/5 h-12 rounded-2xl focus:ring-[#5A5A40]/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Password</Label>
            <Input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              className="bg-[#f9f8f6]/50 dark:bg-zinc-800/30 border-black/5 dark:border-white/5 h-12 rounded-2xl focus:ring-[#5A5A40]/10"
            />
          </div>
          <Button type="submit" className="w-full py-7 text-lg rounded-2xl shadow-xl shadow-[#5A5A40]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Create Account
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-[#5A5A40] dark:text-[#c2c2a3] font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
