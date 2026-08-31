'use client';

import { useState } from 'react';
import { PlotData } from './ZoneView';

interface HouseDetailPanelProps {
  plot: PlotData | null;
  lang: 'en' | 'ar';
  onClose: () => void;
}

const DIRECTION_LABEL: Record<string, { en: string; ar: string }> = {
  northern: { en: 'NORTHERN', ar: 'شمالية' },
  southern: { en: 'SOUTHERN', ar: 'جنوبية' },
  eastern:  { en: 'EASTERN',  ar: 'شرقية'  },
  western:  { en: 'WESTERN',  ar: 'غربية'  },
};

// Sales WhatsApp number in international format WITHOUT the leading "+".
// Override at build/deploy time via NEXT_PUBLIC_WHATSAPP_NUMBER.
const SALES_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966920011058';

export default function HouseDetailPanel({ plot, lang, onClose }: HouseDetailPanelProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!plot) return null;

  const dir = (key: string) => DIRECTION_LABEL[key]?.[lang] ?? key.toUpperCase();
  const isAr = lang === 'ar';

  const handleSend = () => {
    if (!plot) return;
    const lines = isAr
      ? [
          'مرحبًا، أنا مهتم بهذه القطعة في مخطط الأقطار:',
          `رقم القطعة: ${plot.plot_number}`,
          `البلوك: ${plot.block_number}`,
          `المساحة: ${plot.unit_size} م²`,
          '',
          `الاسم: ${name || '-'}`,
          `البريد الإلكتروني: ${email || '-'}`,
          `الهاتف: ${phone ? '+966 ' + phone : '-'}`,
        ]
      : [
          "Hello, I'm interested in this plot in the ALAQTAR master plan:",
          `Plot number: ${plot.plot_number}`,
          `Block: ${plot.block_number}`,
          `Unit size: ${plot.unit_size} m²`,
          '',
          `Name: ${name || '-'}`,
          `Email: ${email || '-'}`,
          `Phone: ${phone ? '+966 ' + phone : '-'}`,
        ];
    const url = `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: '#1a2c27', width: '680px', maxWidth: '96vw', direction: isAr ? 'rtl' : 'ltr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 text-white/50 hover:text-white text-xl leading-none transition-colors z-10"
          style={{ [isAr ? 'left' : 'right']: '1rem' }}
        >
          ×
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-5">
          <p className="text-gray-400 text-xs tracking-[0.18em] uppercase">
            {isAr ? `بلوك ${plot.block_number}` : `BLOCK  ${plot.block_number}`}
          </p>
          <h1
            className="text-white mt-1 tracking-wide"
            style={{ fontSize: '2.2rem', fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', letterSpacing: '0.04em' }}
          >
            {isAr ? `أرض ${plot.plot_number}` : `LAND PLOT ${plot.plot_number}`}
          </h1>
        </div>

        <div className="mx-8 border-t border-white/10" />

        {/* Two-column body */}
        <div className="flex">
          {/* Left: plot details */}
          <div className="flex-1 px-8 py-6 space-y-[11px]">
            <DetailRow label={isAr ? 'المساحة' : 'UNIT SIZE'} value={`${plot.unit_size} m²`} />
            <DetailRow label={isAr ? 'شمال' : 'NORTH'}        value={String(plot.north)} />
            <DetailRow label={isAr ? 'شرق' : 'EAST'}          value={String(plot.east)} />
            <DetailRow label={isAr ? 'جنوب' : 'SOUTH'}        value={String(plot.south)} />
            <DetailRow label={isAr ? 'غرب' : 'WEST'}          value={String(plot.west)} />
            <DetailRow label={isAr ? 'الواجهة 1' : 'FRONT 1'} value={dir(plot.front1)} />
            <DetailRow label={isAr ? 'الواجهة 2' : 'FRONT 2'} value={plot.front2 && plot.front2.toLowerCase() !== 'nan' ? dir(plot.front2) : '-'} />
            <DetailRow label={isAr ? 'عرض الشارع 1' : 'ST. WIDTH 1'} value={`${plot.st_width_1} m`} />
            <DetailRow label={isAr ? 'عرض الشارع 2' : 'ST. WIDTH 2'} value={plot.st_width_2 ? `${plot.st_width_2} m` : '- m'} />
          </div>

          {/* Vertical divider */}
          <div className="w-px bg-white/10 my-6" />

          {/* Right: contact form */}
          <div className="flex-1 px-8 py-6 flex flex-col gap-4">
            {/* Full name */}
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">
                {isAr ? 'الاسم الكامل' : 'Full name'}
              </label>
              <div className="flex items-center border border-white/15 rounded-full px-4 py-2.5 gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="flex items-center border border-white/15 rounded-full px-4 py-2.5 gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-xs block mb-1.5">
                {isAr ? 'رقم الهاتف' : 'Phone number'}
              </label>
              <div className="flex border border-white/15 rounded-full overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-r border-white/15 text-white text-sm whitespace-nowrap">
                  <span>🇸🇦</span>
                  <span>+966</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm px-3 outline-none"
                />
              </div>
            </div>

            {/* Send — opens WhatsApp to the sales number with the plot + contact details */}
            <button
              onClick={handleSend}
              className="w-full py-3 rounded-full text-white text-sm font-semibold tracking-[0.18em] uppercase mt-auto transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C4856A' }}
            >
              {isAr ? 'إرسال عبر واتساب' : 'SEND VIA WHATSAPP'}
            </button>
          </div>
        </div>

        {/* Icons row */}
        <div className="mx-8 border-t border-white/10" />
        <div className="px-8 py-4 flex gap-6 items-center">
          <IconPylon />
          <IconTransformer />
          <IconTriangle />
          <IconPipe />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs tracking-wider shrink-0" style={{ color: '#C4856A' }}>{label}</span>
      <span className="text-white text-sm text-right">{value}</span>
    </div>
  );
}

function IconPylon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round">
      {/* Tower legs */}
      <line x1="16" y1="3" x2="10" y2="29" />
      <line x1="16" y1="3" x2="22" y2="29" />
      {/* Cross arms */}
      <line x1="7" y1="9" x2="25" y2="9" />
      <line x1="9" y1="15" x2="23" y2="15" />
      {/* Braces */}
      <line x1="7" y1="9" x2="9" y2="15" />
      <line x1="25" y1="9" x2="23" y2="15" />
      <line x1="9" y1="15" x2="12" y2="20" />
      <line x1="23" y1="15" x2="20" y2="20" />
      {/* Base spread */}
      <line x1="10" y1="29" x2="8" y2="29" />
      <line x1="22" y1="29" x2="24" y2="29" />
    </svg>
  );
}

function IconTransformer() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round">
      {/* Outer rectangle */}
      <rect x="4" y="4" width="24" height="24" rx="1" />
      {/* Inner grid lines */}
      <line x1="4" y1="12" x2="28" y2="12" />
      <line x1="4" y1="20" x2="28" y2="20" />
      <line x1="12" y1="4" x2="12" y2="28" />
      <line x1="20" y1="4" x2="20" y2="28" />
    </svg>
  );
}

function IconTriangle() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="16,4 29,27 3,27" />
      <line x1="16" y1="12" x2="16" y2="20" />
      <circle cx="16" cy="23" r="1.2" fill="rgba(255,255,255,0.55)" stroke="none" />
    </svg>
  );
}

function IconPipe() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round">
      {/* U-pipe shape */}
      <path d="M7 5 L7 20 Q7 27 16 27 Q25 27 25 20 L25 5" />
      {/* Top caps */}
      <line x1="5" y1="5" x2="9" y2="5" />
      <line x1="23" y1="5" x2="27" y2="5" />
    </svg>
  );
}
