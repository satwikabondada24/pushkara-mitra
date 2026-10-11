import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Accessibility, ParkingCircle, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FavoriteButton from '@/components/FavoriteButton';
import { getStatusText, type Ghat } from '@/data/ghats';

export default function GhatDetailPage() {
  const { id } = useParams();
  const { ghats, crowdData, crowdDataSource, crowdDataError } = useApp();
  const ghat: Ghat | undefined = ghats.find((g) => g.id === id);

  if (!ghat) return <Navigate to="/ghats" replace />;

  const crowd = crowdData.find((item) => item.ghatId === ghat.id);
  const badgeClass =
    crowd?.crowdLevel === 'LOW'
      ? 'badge-status-low'
      : crowd?.crowdLevel === 'MODERATE'
        ? 'badge-status-med'
        : 'badge-status-critical';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/ghats"
        className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Ghats
      </Link>
      <div className="space-y-1">
        <p className="text-[10px] text-slate-500">
          Crowd data: {crowdDataSource === 'supabase' ? 'Supabase' : 'Demo sample'}
        </p>
        {crowdDataError && <p role="status" className="text-xs text-amber-700">{crowdDataError}</p>}
      </div>

      <div className="dark-card overflow-hidden border-[#1E3A54] bg-[#0D1F32]">
        <div className="relative h-64 overflow-hidden">
          <img
            src={ghat.image}
            alt={ghat.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.pexels.com/photos/12112985/pexels-photo-12112985.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F32] to-transparent" />
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                {ghat.city}, {ghat.district}
              </span>
              <h1 className="font-heading font-black text-3xl text-white">{ghat.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton ghatId={ghat.id} ghatName={ghat.name} variant="solid" />
              {crowd && (
                <span className={`${badgeClass} px-3 py-1 rounded-full text-xs font-bold`}>
                  {getStatusText(crowd.crowdLevel)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{ghat.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#172A3A] p-4 rounded-xl text-xs border border-[#1E3A54]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Physical Cap</span>
              <span className="font-mono font-bold text-white text-base">
                {ghat.physicalCapacity.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Effective Cap</span>
              <span className="font-mono font-bold text-cyan-400 text-base">
                {ghat.effectiveCapacity.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Pilgrims</span>
              <span className="font-mono font-bold text-amber-400 text-base">
                {crowd?.activePilgrims.toLocaleString() || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Crowd Level</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {crowd?.crowdPercentage || '—'}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Accessibility className="w-4 h-4" /> {ghat.hasWheelchairRamp ? 'Wheelchair Ramp' : 'No Ramp'}
            </span>
            <span className="flex items-center gap-1">
              <ParkingCircle className="w-4 h-4" /> {ghat.hasParking ? 'Parking Available' : 'No Parking'}
            </span>
          </div>
        </div>
      </div>

      {crowd && (
        <div className="dark-card p-6 border-[#1E3A54] space-y-4 bg-[#0D1F32]">
          <div className="border-b border-[#1E3A54] pb-3 flex justify-between items-center flex-wrap gap-2">
            <h2 className="font-heading font-bold text-xl text-white">Current Crowd Status</h2>
            <span className="text-xs text-slate-400 font-semibold">Updated: {crowd.lastUpdated}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Crowd Density</span>
              <span className="font-mono font-bold text-slate-300">{crowd.crowdPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  crowd.crowdLevel === 'LOW'
                    ? 'bg-emerald-400'
                    : crowd.crowdLevel === 'MODERATE'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                }`}
                style={{ width: `${crowd.crowdPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                <Users className="w-3.5 h-3.5" /> Active Pilgrims
              </div>
              <div className="font-mono font-bold text-white text-base">{crowd.activePilgrims.toLocaleString()}</div>
            </div>
            <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Risk Level</span>
              <span className={`font-bold text-base ${crowd.riskLevel === 'SAFE' ? 'text-emerald-400' : crowd.riskLevel === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'}`}>
                {crowd.riskLevel}
              </span>
            </div>
          </div>

          <div className="bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54] text-xs">
            <span className="text-slate-400 uppercase font-semibold text-[10px]">Recommendation</span>
            <p className="text-slate-300 mt-1">{crowd.recommendation}</p>
          </div>

          <Link
            to="/crowd-map"
            className="glow-btn-primary w-full py-3 text-sm text-center block"
          >
            View on Crowd & Safety Map →
          </Link>
        </div>
      )}
    </div>
  );
}
