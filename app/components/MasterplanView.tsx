'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

interface Zone {
  id: number;
  label: { en: string; ar: string };
  x: number;
  y: number;
  vr360?: { x: number; y: number };
}

const ZONES: Zone[] = [
  { id: 1, label: { en: 'ZONE 1', ar: 'المنطقة 1' }, x: 19, y: 31, vr360: { x: 24, y: 34 } },
  { id: 2, label: { en: 'ZONE 2', ar: 'المنطقة 2' }, x: 34, y: 59, vr360: { x: 20, y: 65 } },
  { id: 3, label: { en: 'ZONE 3', ar: 'المنطقة 3' }, x: 65, y: 56 },
  { id: 4, label: { en: 'ZONE 4', ar: 'المنطقة 4' }, x: 63, y: 26 },
  { id: 5, label: { en: 'ZONE 5', ar: 'المنطقة 5' }, x: 47, y: 21 },
];

interface MasterplanViewProps {
  lang: 'en' | 'ar';
  onZoneClick: (zone: number) => void;
}

function MasterplanContent({
  lang,
  onZoneClick,
}: {
  lang: 'en' | 'ar';
  onZoneClick: (zone: number) => void;
}) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <>
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => zoomIn()}
          className="w-10 h-10 rounded-full bg-[#C4856A] hover:bg-[#B8735E] text-white font-bold flex items-center justify-center transition-all shadow-lg text-lg"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => zoomOut()}
          className="w-10 h-10 rounded-full bg-[#C4856A] hover:bg-[#B8735E] text-white font-bold flex items-center justify-center transition-all shadow-lg text-lg"
          title="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => resetTransform()}
          className="w-10 h-10 rounded-full bg-[#888] hover:bg-[#777] text-white font-bold flex items-center justify-center transition-all shadow-lg text-sm"
          title="Reset view"
        >
          ⊙
        </button>
      </div>

      <TransformComponent
        wrapperStyle={{ width: '100%', height: '100%' }}
        contentStyle={{ width: '1920px', height: '1080px', position: 'relative' }}
      >
        <Image
          src="/images/77.31eab707e81769ce93c2.jpg"
          alt="ALAQTAR Masterplan"
          width={1920}
          height={1080}
          style={{ position: 'absolute', top: 0, left: 0, width: '1920px', height: '1080px' }}
          priority
        />

        {/* Zone markers */}
        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: 'absolute', top: 0, left: 0 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {ZONES.map((zone) => (
            <g key={zone.id} style={{ cursor: 'pointer' }} onClick={() => onZoneClick(zone.id)}>
              {/* Zone marker circle */}
              <circle
                cx={(zone.x / 100) * 1920}
                cy={(zone.y / 100) * 1080}
                r="40"
                fill="#C4856A"
                opacity="0.8"
                style={{ transition: 'opacity 0.3s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
              />

              {/* Zone label */}
              <text
                x={(zone.x / 100) * 1920}
                y={(zone.y / 100) * 1080}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="14"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {lang === 'ar' ? zone.label.ar : zone.label.en}
              </text>

              {/* VR 360 badge if available */}
              {zone.vr360 && (
                <g>
                  <circle
                    cx={(zone.vr360.x / 100) * 1920}
                    cy={(zone.vr360.y / 100) * 1080}
                    r="20"
                    fill="#ef4444"
                    opacity="0.9"
                  />
                  <text
                    x={(zone.vr360.x / 100) * 1920}
                    y={(zone.vr360.y / 100) * 1080}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    360°
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </TransformComponent>
    </>
  );
}

export default function MasterplanView({ lang, onZoneClick }: MasterplanViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minScale, setMinScale] = useState(0.5);

  // "Cover" scale: the smallest zoom at which the 1920x1080 image still fills
  // the visible frame. Clamping minScale to this stops zoom-out from shrinking
  // the plan below the window and exposing the empty background.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const coverScale = Math.max(el.clientWidth / 1920, el.clientHeight / 1080);
      setMinScale(coverScale);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#D4C5B5]">
      <TransformWrapper
        key={minScale}
        initialScale={Math.max(1, minScale)}
        minScale={minScale}
        maxScale={4}
        centerOnInit
        wheel={{ step: 0.2 }}
        pinch={{ step: 0.2 }}
      >
        <MasterplanContent lang={lang} onZoneClick={onZoneClick} />
      </TransformWrapper>
    </div>
  );
}
