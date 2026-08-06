'use client';

import { useEffect, useState } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-600"
      style={{
        backgroundColor: '#C4856A',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Star / compass rose logo */}
      <div className="mb-6 animate-pulse">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          {/* 8-pointed starburst */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1="60"
              y1="60"
              x2={60 + 52 * Math.cos((deg * Math.PI) / 180)}
              y2={60 + 52 * Math.sin((deg * Math.PI) / 180)}
              stroke="white"
              strokeWidth={deg % 90 === 0 ? 2.5 : 1.2}
              opacity={deg % 90 === 0 ? 1 : 0.7}
            />
          ))}
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg, i) => (
            <line
              key={`thin-${i}`}
              x1="60"
              y1="60"
              x2={60 + 38 * Math.cos((deg * Math.PI) / 180)}
              y2={60 + 38 * Math.sin((deg * Math.PI) / 180)}
              stroke="white"
              strokeWidth={0.6}
              opacity={0.4}
            />
          ))}
          <circle cx="60" cy="60" r="5" fill="white" opacity="0.9" />
          {/* Diamond tip */}
          <polygon
            points="60,4 64,55 60,60 56,55"
            fill="white"
            opacity="0.95"
          />
          <polygon
            points="60,116 64,65 60,60 56,65"
            fill="white"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Arabic name */}
      <p className="text-white text-3xl font-light tracking-widest mb-1" style={{ fontFamily: 'serif', letterSpacing: '0.15em' }}>
        الـزمـردة
      </p>

      {/* Latin name */}
      <p className="text-white text-xl font-light tracking-[0.35em] uppercase">
        AL&apos;ZUMURUDA
      </p>

      {/* Loading bar */}
      <div className="mt-12 w-40 h-0.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/70 rounded-full"
          style={{
            width: '100%',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            animation: 'loadBar 2.5s ease-in-out forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes loadBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
