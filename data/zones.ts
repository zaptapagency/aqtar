export type HouseStatus = 'available' | 'sold' | 'reserved';
export type HouseType = 'Villa' | 'Townhouse' | 'Apartment';
export type AmenityType = 'mosque' | 'school' | 'hospital' | 'shopping' | 'park';

export interface House {
  id: string;
  number: number;
  block: string;
  type: HouseType;
  area: number; // sqm
  bedrooms: number;
  bathrooms: number;
  status: HouseStatus;
  price: number; // SAR
  // Position on zone image as percentage (0-100)
  x: number;
  y: number;
}

export interface Amenity {
  id: string;
  type: AmenityType;
  label: string;
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  name: string;
  nameAr: string;
  totalPlots: number;
  availablePlots: number;
  area: number; // sqm
  description: string;
  descriptionAr: string;
  // Position on masterplan image as percentage
  markerX: number;
  markerY: number;
  houses: House[];
  amenities: Amenity[];
  // Zone color for masterplan overlay
  color: string;
}

const generateHouses = (
  zoneId: string,
  count: number,
  cols: number,
  startX: number,
  startY: number,
  spacingX: number,
  spacingY: number
): House[] => {
  const statuses: HouseStatus[] = ['available', 'available', 'available', 'sold', 'reserved'];
  const types: HouseType[] = ['Villa', 'Villa', 'Townhouse', 'Villa', 'Townhouse'];
  const areas = [350, 400, 300, 450, 280, 380, 420, 320];
  const houses: House[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    houses.push({
      id: `${zoneId}-h${i + 1}`,
      number: i + 1,
      block: String.fromCharCode(65 + Math.floor(i / 10)),
      type: types[i % types.length],
      area: areas[i % areas.length],
      bedrooms: i % 3 === 0 ? 4 : 5,
      bathrooms: i % 3 === 0 ? 3 : 4,
      status: statuses[i % statuses.length],
      price: 850000 + (i % 7) * 50000,
      x: startX + col * spacingX,
      y: startY + row * spacingY,
    });
  }
  return houses;
};

export const zones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1',
    nameAr: 'المنطقة 1',
    totalPlots: 120,
    availablePlots: 74,
    area: 180000,
    description: 'Northern residential zone featuring premium villas and townhouses with direct access to the main boulevard.',
    descriptionAr: 'المنطقة السكنية الشمالية تضم فيلات وتاون هاوس فاخرة مع وصول مباشر إلى الشارع الرئيسي.',
    markerX: 27,
    markerY: 28,
    color: 'rgba(134,197,168,0.35)',
    amenities: [
      { id: 'z1-a1', type: 'mosque', label: 'Mosque', x: 12, y: 22 },
      { id: 'z1-a2', type: 'mosque', label: 'Mosque', x: 55, y: 15 },
      { id: 'z1-a3', type: 'mosque', label: 'Mosque', x: 25, y: 58 },
      { id: 'z1-a4', type: 'school', label: 'School', x: 40, y: 48 },
      { id: 'z1-a5', type: 'school', label: 'School', x: 65, y: 48 },
      { id: 'z1-a6', type: 'hospital', label: 'Medical Center', x: 75, y: 15 },
      { id: 'z1-a7', type: 'shopping', label: 'Commercial', x: 85, y: 48 },
    ],
    houses: generateHouses('z1', 48, 8, 5, 5, 11, 22),
  },
  {
    id: 'zone-2',
    name: 'Zone 2',
    nameAr: 'المنطقة 2',
    totalPlots: 140,
    availablePlots: 92,
    area: 210000,
    description: 'Central residential zone with spacious family villas situated near the community park and commercial center.',
    descriptionAr: 'المنطقة السكنية المركزية تضم فيلات عائلية واسعة بالقرب من حديقة المجتمع والمركز التجاري.',
    markerX: 42,
    markerY: 55,
    color: 'rgba(134,197,168,0.35)',
    amenities: [
      { id: 'z2-a1', type: 'mosque', label: 'Mosque', x: 15, y: 30 },
      { id: 'z2-a2', type: 'mosque', label: 'Mosque', x: 50, y: 65 },
      { id: 'z2-a3', type: 'school', label: 'School', x: 40, y: 45 },
      { id: 'z2-a4', type: 'school', label: 'School', x: 70, y: 45 },
      { id: 'z2-a5', type: 'shopping', label: 'Commercial', x: 85, y: 30 },
      { id: 'z2-a6', type: 'park', label: 'Park', x: 30, y: 70 },
    ],
    houses: generateHouses('z2', 56, 8, 5, 5, 11, 18),
  },
  {
    id: 'zone-3',
    name: 'Zone 3',
    nameAr: 'المنطقة 3',
    totalPlots: 130,
    availablePlots: 65,
    area: 195000,
    description: 'Eastern residential zone offering modern townhouses with scenic views and proximity to green spaces.',
    descriptionAr: 'المنطقة السكنية الشرقية تقدم تاون هاوس حديثة مع إطلالات خلابة وقرب من المساحات الخضراء.',
    markerX: 88,
    markerY: 58,
    color: 'rgba(134,197,168,0.35)',
    amenities: [
      { id: 'z3-a1', type: 'mosque', label: 'Mosque', x: 20, y: 25 },
      { id: 'z3-a2', type: 'mosque', label: 'Mosque', x: 65, y: 55 },
      { id: 'z3-a3', type: 'school', label: 'School', x: 45, y: 40 },
      { id: 'z3-a4', type: 'hospital', label: 'Medical Center', x: 80, y: 20 },
      { id: 'z3-a5', type: 'shopping', label: 'Commercial', x: 30, y: 70 },
    ],
    houses: generateHouses('z3', 52, 8, 5, 5, 11, 18),
  },
  {
    id: 'zone-4',
    name: 'Zone 4',
    nameAr: 'المنطقة 4',
    totalPlots: 110,
    availablePlots: 48,
    area: 165000,
    description: 'North-eastern zone featuring exclusive corner plots and premium finishes with panoramic views.',
    descriptionAr: 'المنطقة الشمالية الشرقية تضم قطعاً زاوية حصرية وتشطيبات فاخرة مع إطلالات بانورامية.',
    markerX: 87,
    markerY: 28,
    color: 'rgba(134,197,168,0.35)',
    amenities: [
      { id: 'z4-a1', type: 'mosque', label: 'Mosque', x: 25, y: 20 },
      { id: 'z4-a2', type: 'mosque', label: 'Mosque', x: 70, y: 60 },
      { id: 'z4-a3', type: 'school', label: 'School', x: 50, y: 40 },
      { id: 'z4-a4', type: 'shopping', label: 'Commercial', x: 80, y: 30 },
    ],
    houses: generateHouses('z4', 44, 8, 5, 5, 11, 22),
  },
  {
    id: 'zone-5',
    name: 'Zone 5',
    nameAr: 'المنطقة 5',
    totalPlots: 95,
    availablePlots: 38,
    area: 142000,
    description: 'Premium north zone with the largest plot sizes, backing onto open green belts and walking trails.',
    descriptionAr: 'المنطقة الشمالية الممتازة ذات أكبر مساحات القطع، المطلة على الأحزمة الخضراء ومسارات المشي.',
    markerX: 68,
    markerY: 12,
    color: 'rgba(134,197,168,0.35)',
    amenities: [
      { id: 'z5-a1', type: 'mosque', label: 'Mosque', x: 20, y: 30 },
      { id: 'z5-a2', type: 'school', label: 'School', x: 55, y: 45 },
      { id: 'z5-a3', type: 'hospital', label: 'Medical Center', x: 75, y: 20 },
      { id: 'z5-a4', type: 'park', label: 'Park', x: 35, y: 65 },
    ],
    houses: generateHouses('z5', 38, 8, 5, 5, 11, 22),
  },
];

export const statusColors: Record<HouseStatus, string> = {
  available: '#4CAF50',
  sold: '#F44336',
  reserved: '#FF9800',
};

export const statusLabels: Record<HouseStatus, { en: string; ar: string }> = {
  available: { en: 'Available', ar: 'متاح' },
  sold: { en: 'Sold', ar: 'مباع' },
  reserved: { en: 'Reserved', ar: 'محجوز' },
};
