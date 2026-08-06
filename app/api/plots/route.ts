import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(req: NextRequest) {
  const zone = req.nextUrl.searchParams.get('zone');
  if (!zone) return NextResponse.json({ error: 'zone required' }, { status: 400 });

  try {
    const filePath = join(process.cwd(), 'data', `plots-zone-${zone}.json`);
    const data = readFileSync(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
