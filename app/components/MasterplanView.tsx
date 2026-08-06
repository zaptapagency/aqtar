'use client';

import Image from 'next/image';

interface Zone {
  id: number;
  label: { en: string; ar: string };
  // Position on masterplan image as % of container
  x: number;
  y: number;
  // VR 360 badge positions
  vr360?: { x: number; y: number };
}

const ZONES: Zone[] = [
  { id: 1, label: { en: 'ZONE 1', ar: 'المنطقة 1' }, x: 19, y: 31, vr360: { x: 24, y: 34 } },
  { id: 2, label: { en: 'ZONE 2', ar: 'المنطقة 2' }, x: 34, y: 59, vr360: { x: 20, y: 65 } },
  { id: 3, label: { en: 'ZONE 3', ar: 'المنطقة 3' }, x: 65, y: 56 },
  { id: 4, label: { en: 'ZONE 4', ar: 'المنطقة 4' }, x: 63, y: 26 },
  { id: 5, label: { en: 'ZONE 5', ar: 'المنطقة 5' }, x: 47, y: 21 },
];

// Central VR 360 badge
const CENTRAL_VR = { x: 48, y: 41 };

interface MasterplanViewProps {
  lang: 'en' | 'ar';
  onZoneClick: (zone: number) => void;
}

export default function MasterplanView({ lang, onZoneClick }: MasterplanViewProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#D4C5B5]">
      {/* Masterplan image */}
      <div className="relative w-full h-full">
        <Image
          src="/images/alzumuruda-masterplan.jpg"
          alt="ALAQTAR Masterplan"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay layer for zones */}
        <div className="absolute inset-0">
          {/* Zone labels + orbit markers */}
          {ZONES.map((zone) => (
            <div key={zone.id}>
              {/* Zone label badge */}
              <div
                className="absolute flex items-center gap-1.5 cursor-pointer group"
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => onZoneClick(zone.id)}
              >
                {/* Orbit ring marker */}
                <div
                  className="w-10 h-10 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    boxShadow: '0 0 0 4px rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                </div>
                {/* Label */}
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-white group-hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  {zone.label[lang]}
                </div>
              </div>

              {/* VR 360 badge */}
              {zone.vr360 && (
                <div
                  className="absolute cursor-pointer group"
                  style={{ left: `${zone.vr360.x}%`, top: `${zone.vr360.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => onZoneClick(zone.id)}
                >
                  <div
                    className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold text-[10px] leading-tight group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: '#C4856A', border: '2px solid rgba(255,255,255,0.5)' }}
                  >
                    <span>VR</span>
                    <span>360</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Central VR 360 */}
          <div
            className="absolute cursor-pointer group"
            style={{ left: `${CENTRAL_VR.x}%`, top: `${CENTRAL_VR.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-bold text-xs leading-tight group-hover:scale-110 transition-transform"
              style={{ backgroundColor: '#C4856A', border: '2px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
            >
              <span>VR</span>
              <span>360</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
