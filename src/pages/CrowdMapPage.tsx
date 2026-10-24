src/data/supabase.ts
content":"import { createClient } from '@supabase/supabase-js';
import {
  calculateOccupancyPercentage,
  getCrowdDataStatus,
  getCrowdLevel,
  getRecommendationText,
  getRiskLevel,
  getStatusText,
  type Ghat,
  type GhatCrowdData,
} from '@/data/ghats';

interface DatabaseGhat {
  id: string;
  name: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  physical_capacity: number;
  effective_capacity: number;
  general_ticket_price: number;
  vip_ticket_price: number;
  has_wheelchair_ramp: boolean;
  has_parking: boolean;
  image: string;
  description: string;
}

interface DatabaseCrowdStatus {
  ghat_id: string;
  crowd_percentage?: number | null;
  active_pilgrims: number;
  entry_throughput: number;
  exit_throughput: number;
  updated_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

const supabase =
  hasSupabaseConfig && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function assertGhat(row: DatabaseGhat): Ghat {
  if (
    !row.id ||
    !row.name ||
    !row.city ||
    !row.district ||
    !row.image ||
    !row.description ||
    ![row.latitude, row.longitude].every(Number.isFinite) ||
    row.latitude < -90 ||
    row.latitude > 90 ||
    row.longitude < -180 ||
    row.longitude > 180 ||
    ![
      row.physical_capacity,
      row.effective_capacity,
      row.general_ticket_price,
      row.vip_ticket_price,
    ].every((value) => Number.isFinite(value) && value >= 0) ||
    typeof row.has_wheelchair_ramp !== 'boolean' ||
    typeof row.has_parking !== 'boolean'
  ) {
    throw new Error(`Invalid ghat record returned by Supabase: ${row.id || 'unknown id'}`);
  }

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    district: row.district,
    latitude: row.latitude,
    longitude: row.longitude,
    physicalCapacity: row.physical_capacity,
    effectiveCapacity: row.effective_capacity,
    generalTicketPrice: row.general_ticket_price,
    vipTicketPrice: row.vip_ticket_price,
    hasWheelchairRamp: row.has_wheelchair_ramp,
    hasParking: row.has_parking,
    image: row.image,
    description: row.description,
  };
}

function assertCrowdStatus(row: DatabaseCrowdStatus, ghat: Ghat): GhatCrowdData {
  if (row.ghat_id !== ghat.id) {
    throw new Error(`Crowd status mismatch for ${ghat.name}: expected ${ghat.id}, received ${row.ghat_id}`);
  }

  if (!Number.isFinite(row.active_pilgrims) || row.active_pilgrims < 0) {
    throw new Error(`Invalid active pilgrim count returned by Supabase for ${ghat.name}`);
  }

  if (!Number.isFinite(row.entry_throughput) || row.entry_throughput < 0) {
    throw new Error(`Invalid entry throughput returned by Supabase for ${ghat.name}`);
  }

  if (!Number.isFinite(row.exit_throughput) || row.exit_throughput < 0) {
    throw new Error(`Invalid exit throughput returned by Supabase for ${ghat.name}`);
  }

  if (!Number.isFinite(Date.parse(row.updated_at))) {
    throw new Error(`Invalid timestamp returned by Supabase for ${ghat.name}`);
  }

  if (!Number.isFinite(ghat.effectiveCapacity) || ghat.effectiveCapacity <= 0) {
    throw new Error(`Invalid effective capacity for ${ghat.name}`);
  }

  const crowdPercentage = calculateOccupancyPercentage(row.active_pilgrims, ghat.effectiveCapacity);
  const crowdLevel = getCrowdLevel(crowdPercentage);
  const lastUpdated = new Date(row.updated_at).toISOString();

  return {
    ghatId: ghat.id,
    name: ghat.name,
    latitude: ghat.latitude,
    longitude: ghat.longitude,
    crowdPercentage: Number(crowdPercentage.toFixed(1)),
    crowdLevel,
    riskLevel: getRiskLevel(crowdLevel),
    status: getStatusText(crowdLevel),
    recommendation: getRecommendationText(crowdLevel),
    activePilgrims: Math.round(row.active_pilgrims),
    entryThroughput: row.entry_throughput,
    exitThroughput: row.exit_throughput,
    lastUpdated: new Date(lastUpdated).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dataStatus: getCrowdDataStatus('supabase', lastUpdated),
  };
}

export async function loadSupabaseGhatData(): Promise<{
  ghats: Ghat[];
  crowdData: GhatCrowdData[];
}> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const [ghatResult, crowdResult] = await Promise.all([
    supabase.from('ghats').select('*').order('name'),
    supabase.from('crowd_status').select('*'),
  ]);

  if (ghatResult.error) throw new Error(`Could not load ghats: ${ghatResult.error.message}`);
  if (crowdResult.error) {
    throw new Error(`Could not load crowd status: ${crowdResult.error.message}`);
  }

  const ghats = (ghatResult.data as DatabaseGhat[]).map(assertGhat);
  const ghatsById = new Map(ghats.map((ghat) => [ghat.id, ghat]));
  const crowdData = (crowdResult.data as DatabaseCrowdStatus[]).map((row) => {
    const ghat = ghatsById.get(row.ghat_id);
    if (!ghat) {
      throw new Error(`Crowd status references an unknown ghat: ${row.ghat_id}`);
    }
    return assertCrowdStatus(row, ghat);
  });
  if (crowdData.length !== ghats.length) {
    throw new Error('Crowd status is missing for one or more ghats.');
  }

  return { ghats, crowdData };
}




















































































































































































































































