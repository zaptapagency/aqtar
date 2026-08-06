'use client';

import { useEffect, useRef, useState } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  useTransformEffect,
} from 'react-zoom-pan-pinch';
import Image from 'next/image';

export interface PlotData {
  zone: number;
  plot_number: number;
  block_number: number;
  status: 'available' | 'sold' | 'not_available';
  unit_size: number;
  north: string;
  east: string;
  south: string;
  west: string;
  front1: string;
  front2: string;
  electric_transformer: boolean;
  st_width_1: string;
  st_width_2: string;
}

interface PolygonEntry {
  plotIndex: number;
  path: string;
}

interface ZoneViewProps {
  zoneNumber: number;
  lang: 'en' | 'ar';
  onPlotSelect: (plot: PlotData) => void;
}

const ZONE_IMAGES: Record<number, string> = {
  1: '/images/temp.6391650c9d4164ba4ae4.jpg',
  2: '/images/temp.9238cfb2e4bfd637fe8c.jpg',
  3: '/images/temp.5602ef54321013d12b55.jpg',
  4: '/images/temp.27167260111fe234859b.jpg',
  5: '/images/temp.5b5a8efbdcba5eab8380.jpg',
};

const STATUS_FILL: Record<string, string> = {
  available:     'rgba(255,255,255,0)',
  sold:          'rgba(255,255,255,0)',
  not_available: 'rgba(255,255,255,0)',
};
const STATUS_HOVER: Record<string, string> = {
  available:     'rgba(255,255,255,0.25)',
  sold:          'rgba(255,255,255,0.25)',
  not_available: 'rgba(255,255,255,0.25)',
};

// ------------------------------------------------------------------
// Inner component — lives inside TransformWrapper, can use its hooks
// ------------------------------------------------------------------
function ZoneCanvas({
  zoneNumber, plots, polygons, lang, onPlotSelect,
}: {
  zoneNumber: number;
  plots: PlotData[];
  polygons: PolygonEntry[];
  lang: 'en' | 'ar';
  onPlotSelect: (p: PlotData) => void;
}) {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);

  // useTransformEffect fires on every transform change — safe inside context
  useTransformEffect(({ state }) => {
    setScale(state.scale);
  });

  const showNumbers = scale >= 1.8;
  const getPlot = (idx: number) => plots.find(p => p.plot_number === idx);

  return (
    <>
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        {(['+', '−', '⊙'] as const).map((icon, i) => (
          <button
            key={icon}
            onClick={() => [zoomIn, zoomOut, resetTransform][i]()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm"
            style={{ backgroundColor: i < 2 ? '#C4856A' : '#888' }}
          >{icon}</button>
        ))}
      </div>

      <TransformComponent
        wrapperStyle={{ width: '100%', height: '100%' }}
        contentStyle={{ width: '1920px', height: '1080px', position: 'relative' }}
      >
        {/* Aerial image */}
        <Image
          src={ZONE_IMAGES[zoneNumber] ?? ZONE_IMAGES[1]}
          alt={`Zone ${zoneNumber}`}
          width={1920}
          height={1080}
          style={{ position: 'absolute', top: 0, left: 0, width: '1920px', height: '1080px' }}
          priority
        />

        {/* SVG plot overlay */}
        <svg
          viewBox="0 0 1920 1080"
          width="1920"
          height="1080"
          style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer' }}
        >
          {polygons.map(poly => {
            const plot = getPlot(poly.plotIndex);
            const status = plot?.status ?? 'not_available';
            const isHov = hovered === poly.plotIndex;
            return (
              <g key={poly.plotIndex}>
                <path
                  d={poly.path}
                  fill={isHov ? STATUS_HOVER[status] : STATUS_FILL[status]}
                  stroke={isHov ? 'white' : 'rgba(255,255,255,0.35)'}
                  strokeWidth={isHov ? 1.5 : 0.7}
                  style={{ transition: 'fill 0.12s' }}
                  onMouseEnter={() => setHovered(poly.plotIndex)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => plot && onPlotSelect(plot)}
                />
                {showNumbers && plot && <PlotLabel path={poly.path} plotNumber={plot.plot_number} status={status} />}
              </g>
            );
          })}
        </svg>
      </TransformComponent>

      {/* Zoom hint */}
      {!showNumbers && polygons.length > 0 && (
        <div
          className="absolute bottom-14 right-3 z-20 px-3 py-1.5 rounded-full text-xs text-white/80 pointer-events-none"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          {lang === 'ar' ? 'قرّب لرؤية أرقام القطع' : 'Zoom in to see plot numbers'}
        </div>
      )}
    </>
  );
}

// ------------------------------------------------------------------
// Outer wrapper — handles data fetching
// ------------------------------------------------------------------
export default function ZoneView({ zoneNumber, lang, onPlotSelect }: ZoneViewProps) {
  const [plots, setPlots]       = useState<PlotData[]>([]);
  const [polygons, setPolygons] = useState<PolygonEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [minScale, setMinScale] = useState(0.4);

  // Compute the "cover" scale so zooming out never shrinks the image
  // smaller than the visible frame (which would expose empty background).
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

  useEffect(() => {
    setLoading(true);
    fetch(`/api/plots?zone=${zoneNumber}`)
      .then(r => r.json())
      .then((d: PlotData[]) => { setPlots(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [zoneNumber]);

  useEffect(() => {
    fetch(`/api/polygons?zone=${zoneNumber}`)
      .then(r => r.json())
      .then((d: PolygonEntry[]) => setPolygons(d))
      .catch(() => setPolygons([]));
  }, [zoneNumber]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#E8E0D4]">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{ borderColor: '#C4856A', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      <TransformWrapper key={minScale} initialScale={Math.max(1, minScale)} minScale={minScale} maxScale={8} centerOnInit>
        {() => (
          <ZoneCanvas
            zoneNumber={zoneNumber}
            plots={plots}
            polygons={polygons}
            lang={lang}
            onPlotSelect={onPlotSelect}
          />
        )}
      </TransformWrapper>
    </div>
  );
}

// Centroid label — uses plot_number (unique per polygon, matches live site)
function PlotLabel({ path, plotNumber, status }: { path: string; plotNumber: number; status: string }) {
  const pts = [...path.matchAll(/[ML]\s*([\d.]+)\s+([\d.]+)/g)].map(m => ({
    x: parseFloat(m[1]), y: parseFloat(m[2]),
  }));
  if (!pts.length) return null;
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return (
    <text
      x={cx} y={cy + 4}
      textAnchor="middle"
      fontSize="7"
      fontWeight="bold"
      fill={status === 'not_available' ? '#ddd' : 'white'}
      paintOrder="stroke"
      stroke="rgba(0,0,0,0.7)"
      strokeWidth="1.8"
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      {plotNumber}
    </text>
  );
}
