"use client";

import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"
import { useRouter } from "next/navigation"

const Dithering = lazy(() => 
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <section className="py-24 w-full flex justify-center items-center px-4 md:px-6 bg-transparent">
      <div 
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[48px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm min-h-[500px] flex flex-col items-center justify-center duration-500">
             <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000" // Transparent
                colorFront="#991b1b"  // pen.in Primary
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.4 : 0.1}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#991b1b]/10 bg-[#991b1b]/5 px-4 py-1.5 text-sm font-bold text-[#991b1b] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#991b1b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#991b1b]"></span>
              </span>
              Community Powered
            </div>

            {/* Headline */}
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1a1a1a] dark:text-white mb-8 leading-[1.05]">
              Your story, <br />
              <span className="text-[#991b1b] dark:text-[#f87171] italic">waiting to be told.</span>
            </h2>
            
            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Join 12,480+ writers using pen.in to share their voice with a global audience. 
              Simple, elegant, and uniquely yours.
            </p>

            {/* Button */}
            <button 
              onClick={() => router.push('/write')}
              className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[#991b1b] px-12 text-base font-bold text-white transition-all duration-300 hover:bg-[#7f1d1d] hover:scale-105 active:scale-95 hover:ring-4 hover:ring-[#991b1b]/20"
            >
              <span className="relative z-10">Start Writing</span>
              <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
