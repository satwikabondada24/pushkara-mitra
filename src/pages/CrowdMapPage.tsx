import { Link, useSearchParams } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  Polyline,
} from 'react-leaflet';
import {
  Map as MapIcon,
  Shield,
  Navigation,
  ArrowRight,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  findRecommendedGhat,
  getDirectionsUrl,
  getStatusText,
  type CrowdLevel,
} from '@/data/ghats';

const CENTER: [number, number] = [17.0, 81.72];
const ZOOM = 12;

const levelColor: Record<CrowdLevel, string> = {
  LOW: '#10b981',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
};

export default function CrowdMapPage() {
  const { ghats, crowdData: allCrowdData, crowdDataSource, crowdDataError, refreshCrowdData } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedGhatId = searchParams.get('ghat');

  const selectedGhat = selectedGhatId ? ghats.find((g) => g.id === selectedGhatId) : null;
  const selectedCrowd = selectedGhatId
    ? allCrowdData.find((item) => item.ghatId === selectedGhatId)
    : null;
  const recommendation = selectedGhatId
    ? findRecommendedGhat(selectedGhatId, allCrowdData, ghats)
    : null;

  const routeCoords: [number, number][] | null = (() => {
    if (!recommendation || !selectedGhat) return null;
    return [
      [selectedGhat.latitude, selectedGhat.longitude],
      [recommendation.ghat.latitude, recommendation.ghat.longitude],
    ];
  })();

  const handleGhatClick = (ghatId: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('ghat', ghatId);
    setSearchParams(next);
  };

  const safeCount = allCrowdData.filter((d) => d.crowdLevel === 'LOW').length;
  const moderateCount = allCrowdData.filter((d) => d.crowdLevel === 'MODERATE').length;
  const highCount = allCrowdData.filter((d) => d.crowdLevel === 'HIGH').length;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-xs font-bold">
            <MapIcon className="w-4 h-4" /> Ghat Crowd & Safety Map
          </div>
          <h1 className="font-heading font-black text-3xl text-navy-900">Ghat Crowd & Safety Map</h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Interactive map showing crowd density and risk levels across all Pushkaralu ghats. Click any ghat marker for details and smart recommendations.
          </p>
          <p className="text-xs text-slate-400 italic">
            Crowd data source: {crowdDataSource === 'supabase' ? 'Supabase' : 'demo sample'}.
          </p>
          {crowdDataError && (
            <p role="status" className="text-xs text-amber-700">{crowdDataError}</p>
          )}
          <button
            type="button"
            onClick={() => void refreshCrowdData()}
            className="text-xs font-bold text-godavari hover:underline"
          >
            Refresh crowd data
          </button>
        </div>

        {/* Status summary bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="white-card p-3 border-gray-custom bg-white flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div className="flex-1">
              <div className="text-lg font-bold font-mono text-emerald-600">{safeCount}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Safe / Low</div>
            </div>
          </div>
          <div className="white-card p-3 border-gray-custom bg-white flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <div className="flex-1">
              <div className="text-lg font-bold font-mono text-amber-600">{moderateCount}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Moderate</div>
            </div>
          </div>
          <div className="white-card p-3 border-gray-custom bg-white flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <div className="flex-1">
              <div className="text-lg font-bold font-mono text-rose-500">{highCount}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">High Risk</div>
            </div>
          </div>
        </div>

        {/* Main grid: Map + Side panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 space-y-4">
            <div className="dark-card overflow-hidden border-[#1E3A54] bg-[#0D1F32] relative">
              <div className="h-[min(65vh,540px)] min-h-[360px] w-full">
                <MapContainer
                  center={CENTER}
                  zoom={ZOOM}
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {allCrowdData.map((d) => {
                    const isSelected = d.ghatId === selectedGhatId;
                    const isRecommended = recommendation?.ghat.id === d.ghatId;
                    const radius = isSelected ? 16 : isRecommended ? 14 : 11;
                    const color = isRecommended ? '#10b981' : levelColor[d.crowdLevel];

                    return (
                      <CircleMarker
                        key={d.ghatId}
                        center={[d.latitude, d.longitude]}
                        radius={radius}
                        pathOptions={{
                          color: color,
                          fillColor: isRecommended ? '#10b981' : levelColor[d.crowdLevel],
                          fillOpacity: 0.7,
                          weight: isSelected ? 4 : isRecommended ? 3 : 2,
                        }}
                        eventHandlers={{ click: () => handleGhatClick(d.ghatId) }}
                      >
                        <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '11px', fontWeight: 700 }}>
                            {d.name}: {d.crowdPercentage}%
                          </div>
                        </Tooltip>
                        <Popup>
                          <div style={{ minWidth: '220px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            <PopupContent
                              ghatId={d.ghatId}
                              name={d.name}
                              crowdPercentage={d.crowdPercentage}
                              crowdLevel={d.crowdLevel}
                              riskLevel={d.riskLevel}
                              status={d.status}
                              recommendation={d.recommendation}
                              activePilgrims={d.activePilgrims}
                              lastUpdated={d.lastUpdated}
                              isRecommended={isRecommended}
                            />
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}

                  {routeCoords && (
                    <Polyline
                      positions={routeCoords}
                      pathOptions={{
                        color: '#10b981',
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '8 6',
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="dark-card p-4 border-[#1E3A54] bg-[#0D1F32]">
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" /> Map Legend
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-3 bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-400">GREEN — Safe / Low Crowd</div>
                    <div className="text-slate-400 text-[10px]">Crowd below 40%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-amber-400">ORANGE — Moderate Crowd</div>
                    <div className="text-slate-400 text-[10px]">Crowd 40–70%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                  <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-400 shrink-0" />
                  <div>
                    <div className="font-bold text-rose-400">RED — High Crowd / High Risk</div>
                    <div className="text-slate-400 text-[10px]">Crowd above 70%</div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
                Thresholds: GREEN &lt; 40% • ORANGE 40–70% • RED &gt; 70%. These are configurable for future API integration.
              </p>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Current / selected ghat card */}
            {selectedCrowd && selectedGhat ? (
              <div className="dark-card p-5 border-[#1E3A54] bg-[#0D1F32] space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> Current / Selected Ghat
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-white">{selectedGhat.name}</h3>
                  <span className="text-[10px] text-slate-400 uppercase">{selectedGhat.city}, {selectedGhat.district}</span>
                </div>

                <div className={`px-3 py-2 rounded-xl text-sm font-bold ${
                  selectedCrowd.crowdLevel === 'LOW' ? 'badge-status-low' : selectedCrowd.crowdLevel === 'MODERATE' ? 'badge-status-med' : 'badge-status-critical'
                }`}>
                  {getStatusText(selectedCrowd.crowdLevel)} — {selectedCrowd.crowdPercentage}%
                </div>

                {/* Crowd bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Crowd Density</span>
                    <span className="font-mono font-bold text-slate-300">{selectedCrowd.crowdPercentage}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedCrowd.crowdLevel === 'LOW' ? 'bg-emerald-400' : selectedCrowd.crowdLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${selectedCrowd.crowdPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                      <Users className="w-3.5 h-3.5" /> Active Pilgrims
                    </div>
                    <div className="font-mono font-bold text-white text-base">{selectedCrowd.activePilgrims.toLocaleString()}</div>
                  </div>
                  <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                      <TrendingUp className="w-3.5 h-3.5" /> Entry Flow
                    </div>
                    <div className="font-mono font-bold text-cyan-400 text-base">{selectedCrowd.entryThroughput.toLocaleString()}/hr</div>
                  </div>
                  <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                      <TrendingDown className="w-3.5 h-3.5" /> Exit Flow
                    </div>
                    <div className="font-mono font-bold text-emerald-400 text-base">{selectedCrowd.exitThroughput.toLocaleString()}/hr</div>
                  </div>
                  <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                      <Clock className="w-3.5 h-3.5" /> Updated
                    </div>
                    <div className="font-mono font-bold text-amber-400 text-base">{selectedCrowd.lastUpdated}</div>
                  </div>
                </div>

                {/* Risk level */}
                <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Risk Level</span>
                    <span className={`font-bold ${selectedCrowd.riskLevel === 'SAFE' ? 'text-emerald-400' : selectedCrowd.riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'}`}>
                      {selectedCrowd.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase font-semibold text-[10px]">Recommendation</span>
                    <span className="text-slate-300 text-[11px] text-right">{selectedCrowd.recommendation}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/ghats/${selectedGhat.id}`} className="flex-1 glow-btn-primary font-bold text-xs py-2.5 rounded-xl text-center">
                    View Details →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="dark-card p-5 border-[#1E3A54] bg-[#0D1F32] text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-heading font-bold text-white text-sm">Select a Ghat Marker</h3>
                <p className="text-xs text-slate-400">Click any colored marker on the map to see detailed crowd status and recommendations.</p>
              </div>
            )}

            {/* Recommended ghat card */}
            {recommendation && selectedGhat && selectedCrowd ? (
              <div className="dark-card p-5 border-emerald-500/30 bg-[#0D1F32] space-y-4" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ArrowRight className="w-4 h-4" /> Recommended Alternative Nearby Ghat
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-white">{recommendation.ghat.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase">{recommendation.ghat.city}</span>
                  </div>
                  <span className="badge-status-low px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {getStatusText(recommendation.crowdData.crowdLevel)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-[#172A3A] p-2.5 rounded-xl border border-[#1E3A54] text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-semibold">Distance</div>
                    <div className="font-mono font-bold text-cyan-400 text-sm">
                      {recommendation.distanceM >= 1000
                        ? `${(recommendation.distanceM / 1000).toFixed(1)} km`
                        : `${recommendation.distanceM} m`}
                    </div>
                  </div>
                  <div className="bg-[#172A3A] p-2.5 rounded-xl border border-[#1E3A54] text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-semibold">Crowd</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">{recommendation.crowdData.crowdPercentage}%</div>
                  </div>
                  <div className="bg-[#172A3A] p-2.5 rounded-xl border border-[#1E3A54] text-center">
                    <div className="text-slate-400 text-[9px] uppercase font-semibold">Risk</div>
                    <div className="font-mono font-bold text-emerald-400 text-sm">{recommendation.crowdData.riskLevel}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 inline mr-1" />
                  {selectedCrowd.name} is at {selectedCrowd.crowdPercentage}% capacity. {recommendation.ghat.name} is {recommendation.distanceM >= 1000 ? `${(recommendation.distanceM / 1000).toFixed(1)} km` : `${recommendation.distanceM} m`} away with only {recommendation.crowdData.crowdPercentage}% crowd density. Recommended alternative nearby ghat.
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/ghats/${recommendation.ghat.id}`}
                    className="flex-1 glow-btn-emerald font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    View Ghat Details →
                  </Link>
                  <a
                    href={getDirectionsUrl(
                      selectedGhat.latitude,
                      selectedGhat.longitude,
                      recommendation.ghat.latitude,
                      recommendation.ghat.longitude,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#172A3A] hover:bg-[#1E3A54] text-emerald-300 border border-emerald-500/30 font-bold text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              </div>
            ) : selectedCrowd && selectedCrowd.crowdLevel !== 'HIGH' ? (
              <div className="dark-card p-5 border-[#1E3A54] bg-[#0D1F32] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Shield className="w-4 h-4" /> Status: Safe
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This ghat currently has manageable crowd levels. No alternative recommendation needed — safe to proceed with bathing and rituals.
                </p>
              </div>
            ) : null}

            {/* Quick ghat selector */}
            <div className="dark-card p-4 border-[#1E3A54] bg-[#0D1F32] space-y-3">
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Quick Ghat Select</h3>
              <div className="space-y-2">
                {allCrowdData.map((d) => {
                  const isSelected = d.ghatId === selectedGhatId;
                  const badgeClass = d.crowdLevel === 'LOW' ? 'badge-status-low' : d.crowdLevel === 'MODERATE' ? 'badge-status-med' : 'badge-status-critical';
                  return (
                    <button
                      key={d.ghatId}
                      onClick={() => handleGhatClick(d.ghatId)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border border-cyan-500/40'
                          : 'bg-[#172A3A] border border-[#1E3A54] hover:border-cyan-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${d.crowdLevel === 'LOW' ? 'bg-emerald-400' : d.crowdLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        <span className={`font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>{d.name}</span>
                      </div>
                      <span className={`${badgeClass} px-2 py-0.5 rounded-full text-[9px] font-bold`}>{d.crowdPercentage}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupContent({
  ghatId,
  name,
  crowdPercentage,
  crowdLevel,
  riskLevel,
  status,
  recommendation,
  activePilgrims,
  lastUpdated,
  isRecommended,
}: {
  ghatId: string;
  name: string;
  crowdPercentage: number;
  crowdLevel: CrowdLevel;
  riskLevel: string;
  status: string;
  recommendation: string;
  activePilgrims: number;
  lastUpdated: string;
  isRecommended: boolean;
}) {
  const bgColor =
    crowdLevel === 'LOW' ? 'rgba(16, 185, 129, 0.1)' : crowdLevel === 'MODERATE' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  const borderColor =
    crowdLevel === 'LOW' ? 'rgba(16, 185, 129, 0.3)' : crowdLevel === 'MODERATE' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)';
  const textColor =
    crowdLevel === 'LOW' ? '#10b981' : crowdLevel === 'MODERATE' ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '12px 14px' }}>
      {isRecommended && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '4px 8px', marginBottom: '8px', fontSize: '10px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
          ★ Recommended Alternative
        </div>
      )}
      <div style={{ fontSize: '15px', fontWeight: 800, color: '#17324D', marginBottom: '2px' }}>{name}</div>
      <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>{ghatId}</div>

      <div style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '8px 10px', marginBottom: '8px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: textColor, marginBottom: '4px' }}>{status}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: '#64748b' }}>Crowd:</span>
          <span style={{ fontWeight: 700, color: textColor }}>{crowdPercentage}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: '#64748b' }}>Risk:</span>
          <span style={{ fontWeight: 700, color: textColor }}>{riskLevel}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: '#64748b' }}>Active:</span>
          <span style={{ fontWeight: 700, color: '#334155' }}>{activePilgrims.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, marginBottom: '6px' }}>
        <strong style={{ color: '#17324D' }}>Recommendation:</strong> {recommendation}
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Updated: {lastUpdated}</div>
    </div>
  );
}
