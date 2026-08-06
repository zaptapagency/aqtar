'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        backgroundColor: '#E8D5C4',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* ALZUMURUDA Logo Image */}
      <div className="mb-8 animate-pulse relative w-80 h-80">
        <Image
          src="/images/alzumuruda-masterplan.jpg"
          alt="AL'ZUMURUDA Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

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
