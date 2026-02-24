import React from 'react';
import WordLoader from './word-loader';

export const PencilLoader = () => {
  const writingWords = [
    "imagination",
    "storytelling",
    "creativity",
    "narrative",
    "publishing",
    "pen.in"
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" height="120px" width="120px" viewBox="0 0 200 200" className="pencil">
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" ry="5" rx="5"></rect>
          </clipPath>
        </defs>
        <circle 
          transform="rotate(-113,100,100)" 
          strokeLinecap="round" 
          strokeDashoffset="439.82" 
          strokeDasharray="439.82 439.82" 
          strokeWidth="2" 
          stroke="currentColor" 
          fill="none" 
          r="70" 
          className="pencil__stroke text-[#5A5A40]/20 dark:text-white/10"
        ></circle>
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle 
              transform="rotate(-90)" 
              strokeDashoffset="402" 
              strokeDasharray="402.12 402.12" 
              strokeWidth="30" 
              stroke="#5A5A40" 
              r="64" 
              className="pencil__body1 dark:stroke-[#c2c2a3]"
            ></circle>
            <circle 
              transform="rotate(-90)" 
              strokeDashoffset="465" 
              strokeDasharray="464.96 464.96" 
              strokeWidth="10" 
              stroke="#6b6b4d" 
              r="74" 
              className="pencil__body2 dark:stroke-[#d1d1b8]"
            ></circle>
            <circle 
              transform="rotate(-90)" 
              strokeDashoffset="339" 
              strokeDasharray="339.29 339.29" 
              strokeWidth="10" 
              stroke="#4a4a34" 
              r="54" 
              className="pencil__body3 dark:stroke-[#8a8a62]"
            ></circle>
          </g>
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect height="30" width="30" ry="5" rx="5" fill="#ff9999"></rect>
              <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="#ff8080"></rect>
              <rect height="20" width="30" fill="#e0e0e0"></rect>
              <rect height="20" width="15" fill="#d0d0d0"></rect>
              <rect height="20" width="5" fill="#c0c0c0"></rect>
              <rect height="2" width="30" y="6" fill="rgba(0,0,0,0.1)"></rect>
              <rect height="2" width="30" y="13" fill="rgba(0,0,0,0.1)"></rect>
            </g>
          </g>
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="#e6c27a"></polygon>
            <polygon points="15 0,6 30,0 30" fill="#d4af37"></polygon>
            <polygon points="15 0,20 10,10 10" fill="#333"></polygon>
          </g>
        </g>
      </svg>
      <div className="w-64">
        <WordLoader 
          words={writingWords} 
          className="text-[#5A5A40] dark:text-[#c2c2a3]"
        />
      </div>
    </div>
  );
};
