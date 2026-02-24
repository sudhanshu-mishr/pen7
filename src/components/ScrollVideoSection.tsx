"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollVideoSectionProps {
  videoSrc: string;
  posterSrc?: string;
  className?: string;
}

/**
 * ScrollVideoSection Component
 * 
 * A performant, scroll-triggered video section that uses Intersection Observer
 * (via framer-motion's useInView) to play/pause video based on viewport visibility.
 */
export const ScrollVideoSection: React.FC<ScrollVideoSectionProps> = ({
  videoSrc,
  posterSrc = "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // useInView hook uses Intersection Observer API internally
  // amount: 0.8 means 80% of the element must be visible
  const isInView = useInView(containerRef, { amount: 0.8 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      // When entering viewport: play video
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented:", err);
      });
    } else {
      // When leaving viewport: pause and reset
      videoRef.current.pause();
      // Optional: reset to start if you want it to replay from beginning every time
      // videoRef.current.currentTime = 0;
    }
  }, [isInView]);

  return (
    <section 
      id="video-hero" 
      ref={containerRef}
      className={cn(
        "video-section relative w-full py-24 overflow-hidden flex items-center justify-center bg-transparent",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="relative aspect-video rounded-[2rem] overflow-hidden border-8 border-black/5 dark:border-white/5 shadow-2xl bg-zinc-100 dark:bg-zinc-900">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          
          {/* Overlay for aesthetic blending */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent opacity-0 dark:opacity-40" />
        </div>
        
        {/* Optional caption or indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
            Success Animation
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};
