import { createClient } from '@supabase/supabase-js';
import {
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
  crowd_percentage: number;
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
  if (
    row.ghat_id !== ghat.id ||
    !Number.isFinite(row.crowd_percentage) ||
    row.crowd_percentage < 0 ||
    row.crowd_percentage > 100 ||
    ![row.active_pilgrims, row.entry_throughput, row.exit_throughput].every(
      (value) => Number.isFinite(value) && value >= 0,
    ) ||
    !Number.isFinite(Date.parse(row.updated_at))
  ) {
    throw new Error(`Invalid crowd status returned by Supabase for ${ghat.name}`);
  }

  const crowdLevel = getCrowdLevel(row.crowd_percentage);
  return {
    ghatId: ghat.id,
    name: ghat.name,
    latitude: ghat.latitude,
    longitude: ghat.longitude,
    crowdPercentage: row.crowd_percentage,
    crowdLevel,
    riskLevel: getRiskLevel(crowdLevel),
    status: getStatusText(crowdLevel),
    recommendation: getRecommendationText(crowdLevel),
    activePilgrims: row.active_pilgrims,
    entryThroughput: row.entry_throughput,
    exitThroughput: row.exit_throughput,
    lastUpdated: new Date(row.updated_at).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
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
