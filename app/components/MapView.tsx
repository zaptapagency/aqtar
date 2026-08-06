'use client';

interface MapViewProps {
  lang: 'en' | 'ar';
  onZoneClick: (zone: number) => void;
  onMasterplanClick: () => void;
}

// Hardcoded distance markers matching the live site's map
const LANDMARKS = [
  { label: { en: 'Nublat 11 min', ar: '١١ دقيقة نبلاء' }, x: 40, y: 38 },
  { label: { en: 'Prince Sultan University', ar: 'جامعة الأمير سلطان' }, x: 55, y: 48 },
  { label: { en: 'Masjid Al Muslimeen', ar: 'مسجد المسلمين' }, x: 33, y: 55 },
  { label: { en: 'Prince Faisal Bin Bandar Al Saud Sports', ar: 'نادي رياضي' }, x: 32, y: 65 },
];

const PROJECT_MARKER = { x: 45, y: 45 };

export default function MapView({ lang, onZoneClick, onMasterplanClick }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-[#E8E4DC] overflow-hidden">
      {/* Subtle map grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Road lines (stylized) */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Main road - diagonal */}
        <line x1="0" y1="60%" x2="40%" y2="40%" stroke="#ccc" strokeWidth="3" />
        <line x1="40%" y1="40%" x2="80%" y2="30%" stroke="#ccc" strokeWidth="3" />
        <line x1="20%" y1="80%" x2="60%" y2="50%" stroke="#bbb" strokeWidth="2" />
        <line x1="40%" y1="0" x2="55%" y2="100%" stroke="#bbb" strokeWidth="2" />
      </svg>

      {/* Project location marker (pulsing) */}
      <div
        className="absolute z-10 cursor-pointer"
        style={{ left: `${PROJECT_MARKER.x}%`, top: `${PROJECT_MARKER.y}%`, transform: 'translate(-50%, -50%)' }}
        onClick={onMasterplanClick}
      >
        <div className="relative">
          <div
            className="w-6 h-6 rounded-full absolute -inset-3 animate-ping opacity-30"
            style={{ backgroundColor: '#C4856A' }}
          />
          <div
            className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: '#C4856A' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Distance circles */}
      <div
        className="absolute rounded-full border border-dashed border-gray-300 pointer-events-none"
        style={{
          left: `${PROJECT_MARKER.x}%`,
          top: `${PROJECT_MARKER.y}%`,
          width: '160px',
          height: '160px',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        className="absolute rounded-full border border-dashed border-gray-200 pointer-events-none"
        style={{
          left: `${PROJECT_MARKER.x}%`,
          top: `${PROJECT_MARKER.y}%`,
          width: '280px',
          height: '280px',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Landmark markers */}
      {LANDMARKS.map((lm, i) => (
        <div
          key={i}
          className="absolute flex items-center gap-1.5 cursor-default"
          style={{ left: `${lm.x}%`, top: `${lm.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: '#C4856A' }}
          />
          <div
            className="px-2 py-0.5 rounded text-[10px] text-gray-700 whitespace-nowrap shadow-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
          >
            {lm.label[lang]}
          </div>
        </div>
      ))}

      {/* Toggle controls (Show Distances / Show Circles) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        {[
          lang === 'ar' ? 'إظهار المسافات' : 'Show Distances',
          lang === 'ar' ? 'إظهار الدوائر'  : 'Show Circles',
        ].map((label, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-white shadow"
            style={{ backgroundColor: '#333' }}
          >
            <div className="w-7 h-3.5 rounded-full bg-[#C4856A] relative">
              <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* North indicator */}
      <div
        className="absolute bottom-16 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <polygon points="12,3 9,15 12,13 15,15" fill="white" />
          <polygon points="12,21 9,9 12,11 15,9" fill="rgba(255,255,255,0.4)" />
          <text x="12" y="20" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">N</text>
        </svg>
      </div>
    </div>
  );
}
