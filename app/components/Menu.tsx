'use client';

import { useState } from 'react';

export type View = 'map' | 'masterplan' | 'zone';

interface MenuProps {
  currentView: View;
  currentZone: number | null;
  lang: 'en' | 'ar';
  onNavigate: (view: View, zone?: number) => void;
  onLangToggle: () => void;
  onBack: () => void;
}

const t = {
  en: {
    menu: 'MENU',
    buraydah: 'BURAYDAH',
    masterplan: '3D MASTER PLAN',
    zones: 'ZONES',
    language: 'العربية',
    zone: (n: number) => `Zone ${n}`,
    back: '← Back',
  },
  ar: {
    menu: 'القائمة',
    buraydah: 'بريدة',
    masterplan: 'المخطط الرئيسي ثلاثي الأبعاد',
    zones: 'المناطق',
    language: 'English',
    zone: (n: number) => `المنطقة ${n}`,
    back: 'رجوع →',
  },
};

export default function Menu({ currentView, currentZone, lang, onNavigate, onLangToggle, onBack }: MenuProps) {
  const [zonesOpen, setZonesOpen] = useState(false);
  const tr = t[lang];

  return (
    <div
      className="absolute bottom-4 left-4 z-30 flex flex-col gap-1.5 select-none"
      style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
    >
      {/* Menu label */}
      <div
        className="px-4 py-1.5 rounded-full text-white text-xs font-semibold tracking-widest text-center"
        style={{ backgroundColor: '#B8735E' }}
      >
        {tr.menu}
      </div>

      {/* BURAYDAH */}
      <button
        onClick={() => onNavigate('map')}
        className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all text-left"
        style={{
          backgroundColor: currentView === 'map' ? '#8B5544' : '#C4856A',
          color: 'white',
          border: currentView === 'map' ? '1px solid white' : 'none',
        }}
      >
        {tr.buraydah}
      </button>

      {/* 3D MASTER PLAN */}
      <button
        onClick={() => onNavigate('masterplan')}
        className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all text-left"
        style={{
          backgroundColor: currentView === 'masterplan' ? '#8B5544' : '#C4856A',
          color: 'white',
          border: currentView === 'masterplan' ? '1px solid white' : 'none',
        }}
      >
        {tr.masterplan}
      </button>

      {/* ZONES dropdown */}
      <div className="relative">
        <button
          onClick={() => setZonesOpen(!zonesOpen)}
          className="w-full px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center justify-between gap-2"
          style={{
            backgroundColor: currentView === 'zone' ? '#8B5544' : '#C4856A',
            color: 'white',
            border: currentView === 'zone' ? '1px solid white' : 'none',
          }}
        >
          <span>{tr.zones}</span>
          <span className="text-[10px]">{zonesOpen ? '▲' : '▼'}</span>
        </button>

        {zonesOpen && (
          <div className="absolute bottom-full mb-1 left-0 w-full flex flex-col gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => { onNavigate('zone', n); setZonesOpen(false); }}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all text-left"
                style={{
                  backgroundColor: currentView === 'zone' && currentZone === n ? '#8B5544' : '#C4856A',
                  color: 'white',
                  opacity: 0.92,
                }}
              >
                {tr.zone(n)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Language toggle */}
      <button
        onClick={onLangToggle}
        className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider text-left"
        style={{ backgroundColor: '#D4A090', color: 'white' }}
      >
        {tr.language}
      </button>

      {/* Back button (shown in zone/masterplan view) */}
      {(currentView !== 'map') && (
        <button
          onClick={onBack}
          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wider text-left"
          style={{ backgroundColor: '#6B6B6B', color: 'white' }}
        >
          {tr.back}
        </button>
      )}
    </div>
  );
}
