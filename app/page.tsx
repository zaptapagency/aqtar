'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Splash from './components/Splash';
import Menu, { View } from './components/Menu';
import TopLogo from './components/TopLogo';
import MasterplanView from './components/MasterplanView';
import HouseDetailPanel from './components/HouseDetailPanel';
import { PlotData } from './components/ZoneView';
import MapView from './components/MapView';

const ZoneView = dynamic(() => import('./components/ZoneView'), { ssr: false });

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<View>('masterplan');
  const [zone, setZone] = useState<number | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

  const navigate = (v: View, z?: number) => {
    setView(v);
    setZone(z ?? null);
    setSelectedPlot(null);
  };

  const goBack = () => {
    if (view === 'zone') navigate('masterplan');
    else navigate('map');
  };

  return (
    <main className="w-screen h-screen overflow-hidden relative bg-[#E8E0D4]">
      {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

      {!showSplash && (
        <>
          <TopLogo />

          <div className="absolute inset-0">
            {view === 'map' && (
              <MapView
                lang={lang}
                onZoneClick={(z) => navigate('zone', z)}
                onMasterplanClick={() => navigate('masterplan')}
              />
            )}

            {view === 'masterplan' && (
              <MasterplanView
                lang={lang}
                onZoneClick={(z) => navigate('zone', z)}
              />
            )}

            {view === 'zone' && zone !== null && (
              <div className="relative w-full h-full">
                <ZoneView
                  zoneNumber={zone}
                  lang={lang}
                  onPlotSelect={(plot) => setSelectedPlot(plot)}
                />
                {selectedPlot && (
                  <HouseDetailPanel
                    plot={selectedPlot}
                    lang={lang}
                    onClose={() => setSelectedPlot(null)}
                  />
                )}
              </div>
            )}
          </div>

          <Menu
            currentView={view}
            currentZone={zone}
            lang={lang}
            onNavigate={navigate}
            onLangToggle={() => setLang(l => l === 'en' ? 'ar' : 'en')}
            onBack={goBack}
          />
        </>
      )}
    </main>
  );
}
