'use client';

import Image from 'next/image';

export default function TopLogo() {
  return (
    <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
      <div className="relative w-10 h-10">
        <Image
          src="/images/AlaqtarLogo.80c22de2b49aa7bd43ab.png"
          alt="ALAQTAR"
          fill
          className="object-contain"
        />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-gray-700 tracking-wider">الأقـطـار</p>
        <p className="text-[10px] font-bold tracking-widest text-gray-600">ALAQTAR</p>
        <p className="text-[8px] tracking-[0.2em] text-gray-400">JOIN THE JOURNEY</p>
      </div>
    </div>
  );
}
