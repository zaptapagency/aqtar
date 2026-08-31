'use client';

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
        ]
      : [
          "Hello, I'm interested in this plot in the ALAQTAR master plan:",
          `Plot number: ${plot.plot_number}`,
          `Block: ${plot.block_number}`,
          `Unit size: ${plot.unit_size} m²`,
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

          {/* Right: enquire via WhatsApp (no manual fields — the customer's
              WhatsApp identity carries their name & number automatically) */}
          <div className="flex-1 px-8 py-6 flex flex-col justify-center gap-5">
            <p className="text-gray-300 text-sm leading-relaxed">
              {isAr
                ? 'للاستفسار أو الحجز، تواصل معنا مباشرة عبر واتساب وسيتم إرفاق تفاصيل هذه القطعة تلقائيًا.'
                : 'To enquire or reserve, contact us directly on WhatsApp — this plot’s details are attached automatically.'}
            </p>

            {/* Send — opens WhatsApp to the sales number with the plot details */}
            <button
              onClick={handleSend}
              className="w-full py-3 rounded-full text-white text-sm font-semibold tracking-[0.18em] uppercase transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.45-.15-.64.14-.19.29-.74.93-.9 1.12-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.77.36-.26.29-1.01.99-1.01 2.41 0 1.42 1.03 2.79 1.18 2.98.15.19 2.03 3.1 4.92 4.35.69.3 1.22.47 1.64.6.69.22 1.32.19 1.81.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.05 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 01-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.35 9.35 0 012.75 6.66c0 5.2-4.23 9.42-9.42 9.42zm8.02-17.44A11.32 11.32 0 0012.05.65C5.84.65.8 5.69.8 11.9c0 2 .52 3.94 1.51 5.66L.71 23.35l5.93-1.56a11.27 11.27 0 005.4 1.38h.01c6.21 0 11.25-5.04 11.25-11.25 0-3.01-1.17-5.83-3.23-7.86z"/>
              </svg>
              {isAr ? 'تواصل عبر واتساب' : 'CONTACT VIA WHATSAPP'}
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
