import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(req: NextRequest) {
  const zone = req.nextUrl.searchParams.get('zone');
  if (!zone) return NextResponse.json({ error: 'zone required' }, { status: 400 });

  try {
    const filePath = join(process.cwd(), 'data', 'zones-polygons.json');
    if (!existsSync(filePath)) {
      // Fall back to plot-polygons.json for zone 1
      const fallback = join(process.cwd(), 'data', 'plot-polygons.json');
      if (existsSync(fallback)) {
        const data = JSON.parse(readFileSync(fallback, 'utf-8'));
        // Return first wrapper's plots
        const first = data.wrappers?.[0]?.plots ?? [];
        return NextResponse.json(first);
      }
      return NextResponse.json([]);
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    const key = `zone${zone}` as keyof typeof data;
    return NextResponse.json(data[key] ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
