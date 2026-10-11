import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Shield, Map as MapIcon, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FavoriteButton from '@/components/FavoriteButton';
import { getStatusText } from '@/data/ghats';

export default function DashboardPage() {
  const { userAuth, ghats, favoriteIds, crowdData, crowdDataSource, crowdDataError, bookings } = useApp();
  const savedGhats = ghats.filter((ghat) => favoriteIds.includes(ghat.id));

  const stats = [
    { icon: Calendar, label: 'Active Bookings', value: String(bookings.length), color: 'cyan' },
    { icon: Users, label: 'Pilgrims Booked', value: String(bookings.reduce((total, booking) => total + booking.pilgrimCount, 0)), color: 'emerald' },
    { icon: Heart, label: 'Saved Ghats', value: String(favoriteIds.length), color: 'amber' },
    { icon: Shield, label: 'Safety Alerts', value: '0', color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="dark-card p-6 border-[#1E3A54] bg-[#0D1F32] space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl text-white">My Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome back, {userAuth.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="dark-card p-4 bg-[#0D1F32] space-y-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[s.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">{s.value}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">My Seva Bookings</h2>
            <p className="text-xs text-amber-300">Demo bookings are stored in this browser only; they are not sent to a temple or payment service.</p>
          </div>
          <Link to="/pujas" className="text-xs font-bold text-cyan-400 hover:underline">Browse devotional sevas</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="dark-card p-5 text-sm text-slate-400">No demo bookings yet. Choose a seva from Devotional Pujas to try the booking flow.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const ghat = ghats.find((item) => item.id === booking.ghatId);
              return (
                <div key={booking.id} className="dark-card p-5 border-[#1E3A54] bg-[#0D1F32] space-y-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="font-heading font-bold text-white">{booking.pujaName}</h3>
                    <span className="badge-status-low px-2.5 py-0.5 rounded-full text-[10px] font-bold">{booking.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">Reference: {booking.id}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#172A3A] p-3 rounded-xl border border-[#1E3A54]">
                    <div><span className="text-slate-400 block text-[10px] uppercase">Date</span><span className="font-bold text-white">{new Date(`${booking.scheduledAt}T00:00:00`).toLocaleDateString()}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase">Ghat</span><span className="font-bold text-white">{ghat?.name ?? 'Ghat unavailable'}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase">Pilgrims</span><span className="font-bold text-emerald-400">{booking.pilgrimCount}</span></div>
                    <div><span className="text-slate-400 block text-[10px] uppercase">Indicative Dakshina</span><span className="font-bold text-white">₹{booking.totalDakshina}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading font-bold text-xl text-white">My Saved Ghats</h2>
          <Link to="/ghats?saved=true" className="text-xs font-bold text-cyan-400 hover:underline">
            Manage saved
          </Link>
        </div>
        {savedGhats.length === 0 ? (
          <div className="dark-card p-6 bg-[#0D1F32] space-y-3">
            <p className="text-sm text-slate-400">
              You have not saved any ghats yet. Bookmark a few while you explore, then check crowd
              levels here before you travel.
            </p>
            <Link to="/ghats" className="glow-btn-primary px-4 py-2 text-xs inline-flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" />
              Explore ghats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedGhats.map((ghat) => {
              const crowd = crowdData.find((item) => item.ghatId === ghat.id);
              const badgeClass =
                crowd?.crowdLevel === 'LOW'
                  ? 'badge-status-low'
                  : crowd?.crowdLevel === 'MODERATE'
                    ? 'badge-status-med'
                    : 'badge-status-critical';
              return (
                <div key={ghat.id} className="dark-card p-4 bg-[#0D1F32] space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{ghat.city}</span>
                      <h3 className="font-heading font-bold text-white">{ghat.name}</h3>
                    </div>
                    <FavoriteButton ghatId={ghat.id} ghatName={ghat.name} />
                  </div>
                  {crowd && (
                    <div className="flex items-center justify-between gap-2">
                      <span className={`${badgeClass} px-2 py-0.5 rounded-full text-[9px] font-bold`}>
                        {getStatusText(crowd.crowdLevel)}
                      </span>
                      <span className="text-xs font-mono text-slate-300">{crowd.crowdPercentage}%</span>
                    </div>
                  )}
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-white">Ghat Crowd Status</h2>
          <p className="text-xs text-slate-400">
            Data source: {crowdDataSource === 'supabase' ? 'Supabase' : 'Demo sample'}
          </p>
          {crowdDataError && <p role="status" className="text-xs text-amber-300">{crowdDataError}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crowdData.slice(0, 6).map((d) => {
            const badgeClass =
              d.crowdLevel === 'LOW' ? 'badge-status-low' : d.crowdLevel === 'MODERATE' ? 'badge-status-med' : 'badge-status-critical';
            return (
              <div key={d.ghatId} className="dark-card p-4 bg-[#0D1F32] space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-heading font-bold text-white text-sm">{d.name}</h3>
                  <span className={`${badgeClass} px-2 py-0.5 rounded-full text-[9px] font-bold`}>{getStatusText(d.crowdLevel)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${d.crowdLevel === 'LOW' ? 'bg-emerald-400' : d.crowdLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${d.crowdPercentage}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{d.crowdPercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/crowd-map" className="glow-btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
          <MapIcon className="w-4 h-4" /> View Full Crowd Map
        </Link>
      </div>
    </div>
  );
}
