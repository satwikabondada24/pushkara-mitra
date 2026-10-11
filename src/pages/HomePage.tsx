
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Utensils,
  Shield,
  Sparkles,
  TrendingUp,
  Map as MapIcon,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { getStatusText } from '@/data/ghats';

export default function HomePage() {
  const navigate = useNavigate();
  const { ghats, crowdData, crowdDataSource, crowdDataError } = useApp();
  const [search, setSearch] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const totalPilgrims = crowdData.reduce((sum, d) => sum + d.activePilgrims, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/ghats?search=${encodeURIComponent(search.trim())}`);
  };

  const findNearMe = () => {
    setLocationError('');
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          const params = new URLSearchParams({
            nearMe: 'true',
            lat: String(position.coords.latitude),
            lng: String(position.coords.longitude),
          });
          navigate(`/ghats?${params.toString()}`);
        },
        (error) => {
          setLocating(false);
          setLocationError(
            error.code === error.PERMISSION_DENIED
              ? 'Location access was denied. Allow location access and try again.'
              : 'Could not determine your location. Check your device settings and try again.',
          );
        },
        { timeout: 10000, maximumAge: 60000 },
      );
    } else {
      setLocating(false);
      setLocationError('Location services are not available in this browser.');
    }
  };

  const featureCards = [
    {
      icon: MapIcon,
      title: 'Ghat Crowd & Safety Map',
      desc: 'Live interactive map with crowd risk indicators and smart ghat recommendations.',
      to: '/crowd-map',
      color: 'emerald',
    },
    {
      icon: Sparkles,
      title: 'Smart Ghat Recommendation',
      desc: 'Explainable AI engine to find peaceful ghats with low crowd density.',
      to: '/recommendation',
      color: 'cyan',
    },
    {
      icon: Utensils,
      title: 'Free Annadanam Directory',
      desc: 'Locate free meal centers, prasadam distribution points, and food stalls near ghats.',
      to: '/food',
      color: 'emerald',
    },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-0 pb-16">
      <div className="bg-gradient-to-r from-amber-500/20 via-saffron-500/30 to-amber-500/20 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs font-semibold backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <span className="bg-saffron-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {crowdDataSource === 'supabase' ? 'Crowd Alert' : 'Sample Alert'}
          </span>
          <span className="text-amber-100 text-center">
            {crowdData.find((d) => d.ghatId === 'pushkar-ghat') ? (
              <>
                <strong>Pushkar Ghat</strong> is at{' '}
                <strong>{crowdData.find((d) => d.ghatId === 'pushkar-ghat')?.crowdPercentage}% capacity</strong>
                {' '}— check the crowd map for alternatives.
              </>
            ) : (
              <>Check the crowd map for current ghat conditions.</>
            )}
          </span>
        </div>
      </div>
      {crowdDataError && (
        <div role="status" className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
          {crowdDataError}
        </div>
      )}

      <section className="relative py-14 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#1E3A54] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/godavari-home.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06121E]/40 via-[#0D1F32]/35 to-[#06121E]/60" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="flex justify-center">
            <Logo className="w-20 h-20 drop-shadow-[0_0_30px_rgba(0,180,216,0.8)]" isLightBg={false} />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight drop-shadow-xl">
              PUSHKARA MITRA
            </h1>
            <p className="text-xs sm:text-sm font-extrabold text-cyan-300 uppercase tracking-widest bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 inline-block px-4 py-1.5 rounded-full shadow-lg">
              🌊 GODAVARI PUSHKARALU • DIGITAL PILGRIM ECOSYSTEM
            </p>
          </div>
          <p className="text-sm sm:text-base text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Your digital companion for a safe, organized and accessible Godavari Pushkaralu pilgrimage across Rajamahendravaram, Kovvur, and Pattiseema ghats.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={findNearMe}
              disabled={locating}
              className="glow-btn-emerald px-6 py-3.5 text-sm flex items-center gap-2 shadow-2xl"
            >
              <MapPin className="w-4 h-4 animate-bounce text-white" />
              {locating ? 'Locating Nearest Ghats...' : 'Find Ghats Near Me (GPS)'}
            </button>
            {locationError && <p role="alert" className="w-full text-sm text-rose-200">{locationError}</p>}
            <Link to="/crowd-map" className="glow-btn-primary px-6 py-3.5 text-sm flex items-center gap-2 shadow-2xl">
              <MapIcon className="w-4 h-4" />
              Crowd & Safety Map
            </Link>
            <Link to="/recommendation" className="glow-btn-saffron px-6 py-3.5 text-sm flex items-center gap-2 shadow-2xl">
              <Sparkles className="w-4 h-4" />
              Smart Ghat Recommendation
            </Link>
          </div>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
            <div className="dark-card p-2 flex items-center gap-2 shadow-2xl border-[#1E3A54] bg-[#0D1F32]/95 backdrop-blur-md">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Pushkar Ghat, Kotilingala Revu, Kovvur, Pattiseema..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none px-2 border-none placeholder-slate-400"
              />
              <button type="submit" className="glow-btn-primary px-5 py-2.5 text-xs shrink-0">
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-[#0D1F32] border-b border-[#1E3A54]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-4 text-center text-[10px] text-slate-400">
              Crowd data: {crowdDataSource === 'supabase' ? 'Supabase' : 'Demo sample'}
            </div>
            <div className="dark-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-cyan-400">{ghats.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Active Ghats</div>
            </div>
            <div className="dark-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-emerald-400">{totalPilgrims.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Active Pilgrims</div>
            </div>
            <div className="dark-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-amber-400">
                {crowdData.filter((d) => d.crowdLevel === 'HIGH').length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">High Risk Ghats</div>
            </div>
            <div className="dark-card p-4 text-center">
              <div className="text-2xl font-bold font-mono text-slate-200">
                {crowdData.filter((d) => d.crowdLevel === 'LOW').length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">Safe Ghats</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-navy-900">Integrated Pilgrim Services</h2>
            <p className="text-slate-600 text-sm">
              Comprehensive digital modules designed for pilgrim convenience, crowd safety, and devotional access.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} to={card.to} className="dark-card dark-card-hover p-6 flex flex-col justify-between space-y-5 bg-[#0D1F32]">
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[card.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white">{card.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0A1828] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#1E3A54]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Shield className="w-4 h-4" /> Crowd Risk Monitor
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">Current Ghat Crowd Status</h2>
            <p className="text-slate-400 text-sm">
              Crowd data source: {crowdDataSource === 'supabase' ? 'Supabase' : 'demo sample'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crowdData.slice(0, 6).map((d) => {
              const badgeClass =
                d.crowdLevel === 'LOW'
                  ? 'badge-status-low'
                  : d.crowdLevel === 'MODERATE'
                    ? 'badge-status-med'
                    : 'badge-status-critical';
              return (
                <div key={d.ghatId} className="dark-card p-5 space-y-3 bg-[#0D1F32]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-bold text-white text-sm">{d.name}</h3>
                      <span className="text-[10px] text-slate-500 uppercase">{d.ghatId}</span>
                    </div>
                    <span className={`${badgeClass} px-2.5 py-0.5 rounded-full text-[10px] font-bold`}>
                      {getStatusText(d.crowdLevel)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          d.crowdLevel === 'LOW'
                            ? 'bg-emerald-400'
                            : d.crowdLevel === 'MODERATE'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                        }`}
                        style={{ width: `${d.crowdPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{d.crowdPercentage}%</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{d.activePilgrims.toLocaleString()} active pilgrims</div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/crowd-map" className="glow-btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              View Full Crowd & Safety Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
