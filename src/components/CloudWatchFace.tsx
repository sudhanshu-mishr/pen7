"use client";

import React, { useState, useEffect } from "react";
import { useThemeStore } from "../store";

interface CloudWatchFaceProps {
  isTyping: boolean;
}

export const CloudWatchFace: React.FC<CloudWatchFaceProps> = ({ isTyping }) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40;
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20;
    setEyePos({ x: offsetX, y: offsetY });
  }, [cursor]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-70 h-40 mx-auto mb-6 group">
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20 pointer-events-none rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <img
        src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/cloud.jpg"
        alt="cartoon"
        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-screen dark:brightness-110 dark:contrast-125 transition-all duration-500"
      />

      {["left", "right"].map((side, idx) => (
        <div
          key={side}
          className="absolute flex justify-center items-end overflow-hidden shadow-inner"
          style={{
            top: 60,
            left: idx === 0 ? 80 : 150,
            width: 28,
            height: isTyping
              ? 4 // fully closed when typing password
              : blink
              ? 6 // temporary blink
              : 40, // open eye
            borderRadius: isTyping || blink ? "2px" : "50% / 60%",
            backgroundColor: isTyping 
              ? (isDark ? "#c2c2a3" : "black") 
              : "white",
            transition: "all 0.15s ease",
            boxShadow: isTyping ? "none" : "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {!isTyping && (
            <div
              className="bg-black dark:bg-zinc-900"
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                marginBottom: 4, // pupil at bottom
                transform: `translate(${eyePos.x}px, 0px)`,
                transition: "all 0.1s ease",
                boxShadow: "0 0 2px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
