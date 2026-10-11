export interface Ghat {
  id: string;
  name: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  physicalCapacity: number;
  effectiveCapacity: number;
  generalTicketPrice: number;
  vipTicketPrice: number;
  hasWheelchairRamp: boolean;
  hasParking: boolean;
  image: string;
  description: string;
}

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type RiskLevel = 'SAFE' | 'MODERATE' | 'HIGH';

export interface GhatCrowdData {
  ghatId: string;
  name: string;
  latitude: number;
  longitude: number;
  crowdPercentage: number;
  crowdLevel: CrowdLevel;
  riskLevel: RiskLevel;
  status: string;
  recommendation: string;
  activePilgrims: number;
  entryThroughput: number;
  exitThroughput: number;
  lastUpdated: string;
}

export const THRESHOLDS = {
  LOW: 40,
  MODERATE: 70,
};

export function getCrowdLevel(percentage: number): CrowdLevel {
  if (percentage < THRESHOLDS.LOW) return 'LOW';
  if (percentage <= THRESHOLDS.MODERATE) return 'MODERATE';
  return 'HIGH';
}

export function getRiskLevel(crowdLevel: CrowdLevel): RiskLevel {
  switch (crowdLevel) {
    case 'LOW':
      return 'SAFE';
    case 'MODERATE':
      return 'MODERATE';
    case 'HIGH':
      return 'HIGH';
  }
}

export function getStatusText(crowdLevel: CrowdLevel): string {
  switch (crowdLevel) {
    case 'LOW':
      return '🟢 Safe / Low Crowd';
    case 'MODERATE':
      return '🟠 Moderate Crowd';
    case 'HIGH':
      return '🔴 High Crowd / High Risk';
  }
}

export function getRecommendationText(crowdLevel: CrowdLevel): string {
  switch (crowdLevel) {
    case 'LOW':
      return 'Safe to proceed — ideal for bathing and rituals';
    case 'MODERATE':
      return 'Exercise caution — expect moderate waiting times';
    case 'HIGH':
      return 'Avoid — nearby safer ghat available';
  }
}

export const ghats: Ghat[] = [
  {
    id: 'pushkar-ghat',
    name: 'Pushkar Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 16.9944,
    longitude: 81.7675,
    physicalCapacity: 40000,
    effectiveCapacity: 35000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: true,
    hasParking: true,
image: '/godavari-home.png',
    description:
      'The primary and most sacred ghat located in Rajamahendravaram. Features wide granite steps, emergency medical booths, and high-capacity holding areas along the Godavari River.',
  },
  {
    id: 'kotilingala-revu',
    name: 'Kotilingala Revu',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 17.0015,
    longitude: 81.7720,
    physicalCapacity: 30000,
    effectiveCapacity: 27000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: true,
    hasParking: true,
    image:
      'https://images.pexels.com/photos/35378814/pexels-photo-35378814.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Famous for Sri Kotilingeswara Swamy Temple. Spanning over 1 kilometer length, it offers smooth entry and exit channels for large pilgrim groups.',
  },
  {
    id: 'saraswati-ghat',
    name: 'Saraswati Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 16.9880,
    longitude: 81.7600,
    physicalCapacity: 20000,
    effectiveCapacity: 18000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: true,
    hasParking: false,
    image:
      'https://images.pexels.com/photos/5972823/pexels-photo-5972823.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'A peaceful ghat ideal for families, senior citizens, and pilgrims looking for lower congestion during peak pushkaram hours.',
  },
  {
    id: 'gowthami-ghat',
    name: 'Gowthami Ghat',
    city: 'Rajamahendravaram',
    district: 'East Godavari',
    latitude: 17.0100,
    longitude: 81.7580,
    physicalCapacity: 22000,
    effectiveCapacity: 20000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: false,
    hasParking: true,
    image:
      'https://images.pexels.com/photos/5972824/pexels-photo-5972824.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Located near ISKCON temple with wide promenade, scenic views, and dedicated changing rooms along the riverbank.',
  },
  {
    id: 'goshpada-kshetram',
    name: 'Goshpada Kshetram (Main Kovvur)',
    city: 'Kovvur',
    district: 'West Godavari',
    latitude: 17.0167,
    longitude: 81.6833,
    physicalCapacity: 35000,
    effectiveCapacity: 32000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: true,
    hasParking: true,
    image:
      'https://images.pexels.com/photos/37172603/pexels-photo-37172603.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'The main holy ghat on the West Godavari bank at Kovvur, famous for ancestral rites and holy Pushkaram baths.',
  },
  {
    id: 'subrahmanyeswara-ghat',
    name: 'Subrahmanyeswara Ghat',
    city: 'Kovvur',
    district: 'West Godavari',
    latitude: 17.0200,
    longitude: 81.6780,
    physicalCapacity: 18000,
    effectiveCapacity: 15000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: false,
    hasParking: true,
    image:
      'https://images.pexels.com/photos/39915969/pexels-photo-39915969.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Serene Kovvur riverfront ghat with shallow water entry points and dedicated safety barriers.',
  },
  {
    id: 'pattiseema-ghat',
    name: 'Pattiseema Ghat',
    city: 'Pattiseema',
    district: 'West Godavari',
    latitude: 17.1050,
    longitude: 81.6200,
    physicalCapacity: 22000,
    effectiveCapacity: 19000,
    generalTicketPrice: 0,
    vipTicketPrice: 50,
    hasWheelchairRamp: true,
    hasParking: true,
    image:
      'https://images.pexels.com/photos/29759691/pexels-photo-29759691.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Picturesque ghat situated near Sri Veerabhadra Swamy Temple hill island in the middle of Godavari river.',
  },
];

export const demoCrowdPercentages: Record<string, number> = {
  'pushkar-ghat': 88,
  'kotilingala-revu': 72,
  'saraswati-ghat': 32,
  'gowthami-ghat': 55,
  'goshpada-kshetram': 78,
  'subrahmanyeswara-ghat': 25,
  'pattiseema-ghat': 42,
};

const demoEntryThroughput: Record<string, number> = {
  'pushkar-ghat': 12000,
  'kotilingala-revu': 9500,
  'saraswati-ghat': 6000,
  'gowthami-ghat': 7000,
  'goshpada-kshetram': 11000,
  'subrahmanyeswara-ghat': 5000,
  'pattiseema-ghat': 6500,
};

const demoExitThroughput: Record<string, number> = {
  'pushkar-ghat': 10500,
  'kotilingala-revu': 8800,
  'saraswati-ghat': 5800,
  'gowthami-ghat': 6500,
  'goshpada-kshetram': 10000,
  'subrahmanyeswara-ghat': 4800,
  'pattiseema-ghat': 6000,
};

export function getDemoCrowdData(ghatList: Ghat[] = ghats): GhatCrowdData[] {
  return ghatList.map((g) => {
    const pct = demoCrowdPercentages[g.id] ?? 50;
    const crowdLevel = getCrowdLevel(pct);
    const riskLevel = getRiskLevel(crowdLevel);
    return {
      ghatId: g.id,
      name: g.name,
      latitude: g.latitude,
      longitude: g.longitude,
      crowdPercentage: pct,
      crowdLevel,
      riskLevel,
      status: getStatusText(crowdLevel),
      recommendation: getRecommendationText(crowdLevel),
      activePilgrims: Math.round((pct / 100) * g.effectiveCapacity),
      entryThroughput: demoEntryThroughput[g.id] ?? 6000,
      exitThroughput: demoExitThroughput[g.id] ?? 5500,
      lastUpdated: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface RecommendedGhat {
  ghat: Ghat;
  crowdData: GhatCrowdData;
  distanceKm: number;
  distanceM: number;
}

export function findRecommendedGhat(
  currentGhatId: string,
  allCrowdData: GhatCrowdData[],
  ghatList: Ghat[] = ghats,
): RecommendedGhat | null {
  const currentGhat = ghatList.find((g) => g.id === currentGhatId);
  const currentCrowd = allCrowdData.find((d) => d.ghatId === currentGhatId);
  if (!currentGhat || !currentCrowd) return null;

  if (currentCrowd.crowdLevel !== 'HIGH') return null;

  const candidates = allCrowdData
    .filter((d) => d.ghatId !== currentGhatId && d.crowdLevel !== 'HIGH')
    .map((d) => {
      const g = ghatList.find((gg) => gg.id === d.ghatId);
      if (!g) return null;
      const distKm = haversineDistance(
        currentGhat.latitude,
        currentGhat.longitude,
        g.latitude,
        g.longitude,
      );
      return { ghat: g, crowdData: d, distanceKm: distKm, distanceM: Math.round(distKm * 1000) };
    })
    .filter((candidate): candidate is RecommendedGhat => candidate !== null)
    .sort((a, b) => {
      if (a.crowdData.crowdLevel !== b.crowdData.crowdLevel) {
        const priority = { LOW: 0, MODERATE: 1, HIGH: 2 };
        return priority[a.crowdData.crowdLevel] - priority[b.crowdData.crowdLevel];
      }
      return a.distanceKm - b.distanceKm;
    });

  return candidates[0] ?? null;
}

export function getDirectionsUrl(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): string {
  return `https://www.openstreetmap.org/directions?from=${fromLat}%2C${fromLng}&to=${toLat}%2C${toLng}`;
}
