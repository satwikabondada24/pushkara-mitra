import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Heart, Accessibility, ParkingCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import FavoriteButton from '@/components/FavoriteButton';
import { getStatusText, haversineDistance } from '@/data/ghats';

export default function GhatsPage() {
  const { ghats, favoriteIds, crowdData, crowdDataSource, crowdDataError } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search')?.toLowerCase() || '';
  const nearMe = searchParams.get('nearMe') === 'true';
  const latitude = Number(searchParams.get('lat'));
  const longitude = Number(searchParams.get('lng'));
  const hasLocation =
    nearMe &&
    searchParams.has('lat') &&
    searchParams.has('lng') &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;
  const showSavedOnly = searchParams.get('saved') === 'true';

  const setShowSavedOnly = (value: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('saved', 'true');
    else next.delete('saved');
    setSearchParams(next);
  };

  const filtered = ghats.filter((g) => {
    const matchesSearch =
      !search ||
      g.name.toLowerCase().includes(search) ||
      g.city.toLowerCase().includes(search) ||
      g.district.toLowerCase().includes(search);
    const matchesSaved = !showSavedOnly || favoriteIds.includes(g.id);
    return matchesSearch && matchesSaved;
  }).sort((a, b) => {
    if (!hasLocation) return 0;
    return (
      haversineDistance(latitude, longitude, a.latitude, a.longitude) -
      haversineDistance(latitude, longitude, b.latitude, b.longitude)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-softblue border border-blue-200 text-godavari text-xs font-bold">
          <Calendar className="w-4 h-4" /> Explore Ghats
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[10px] text-slate-500">
            Crowd data: {crowdDataSource === 'supabase' ? 'Supabase' : 'Demo sample'}
          </p>
          {crowdDataError && <p role="status" className="text-xs text-amber-700">{crowdDataError}</p>}
        </div>
        <h1 className="font-heading font-black text-3xl text-navy-900">Explore Pushkaralu Ghats</h1>
        <p className="text-slate-600 text-sm">
          {nearMe
            ? hasLocation
              ? 'Showing ghats sorted by distance from your location.'
              : 'Location coordinates are missing. Return to Home and allow location access to sort by distance.'
            : 'Browse all active ghats with crowd status and safety information.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          aria-pressed={showSavedOnly}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
            showSavedOnly
              ? 'bg-rose-500/15 text-rose-500 border-rose-400/40'
              : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-current' : ''}`} />
          Saved ghats {favoriteIds.length > 0 ? `(${favoriteIds.length})` : ''}
        </button>
        <p className="text-xs text-slate-500">
          {filtered.length} ghat{filtered.length === 1 ? '' : 's'} shown
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="white-card p-8 text-center space-y-2 bg-white">
          <Heart className="w-8 h-8 mx-auto text-rose-400" />
          <h2 className="font-heading font-bold text-navy-900">No saved ghats yet</h2>
          <p className="text-sm text-slate-600">
            Tap the heart on any ghat card to bookmark it for your pilgrimage plan.
          </p>
          {showSavedOnly && (
            <button
              type="button"
              onClick={() => setShowSavedOnly(false)}
              className="text-xs font-bold text-godavari hover:underline"
            >
              Show all ghats
            </button>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ghat) => {
          const crowd = crowdData.find((item) => item.ghatId === ghat.id);
          const badgeClass =
            crowd?.crowdLevel === 'LOW'
              ? 'badge-status-low'
              : crowd?.crowdLevel === 'MODERATE'
                ? 'badge-status-med'
                : 'badge-status-critical';

          return (
            <div
              key={ghat.id}
              className="dark-card overflow-hidden border-[#1E3A54] bg-[#0D1F32] flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={ghat.image}
                  alt={ghat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.pexels.com/photos/12112985/pexels-photo-12112985.jpeg?auto=compress&cs=tinysrgb&w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1F32] to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <FavoriteButton ghatId={ghat.id} ghatName={ghat.name} />
                </div>
                {crowd && (
                  <span
                    className={`absolute top-3 right-3 ${badgeClass} px-2.5 py-0.5 rounded-full text-[10px] font-bold`}
                  >
                    {getStatusText(crowd.crowdLevel)}
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    {ghat.city}, {ghat.district}
                  </span>
                  <h2 className="font-heading font-black text-xl text-white">{ghat.name}</h2>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ghat.description}</p>

                {crowd && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            crowd.crowdLevel === 'LOW'
                              ? 'bg-emerald-400'
                              : crowd.crowdLevel === 'MODERATE'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                          }`}
                          style={{ width: `${crowd.crowdPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {crowd.crowdPercentage}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Accessibility className="w-3.5 h-3.5" />
                    {ghat.hasWheelchairRamp ? 'Ramp' : 'No Ramp'}
                  </span>
                  <span className="flex items-center gap-1">
                    <ParkingCircle className="w-3.5 h-3.5" />
                    {ghat.hasParking ? 'Parking' : 'No Parking'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {ghat.effectiveCapacity.toLocaleString()} cap
                  </span>
                  {hasLocation && (
                    <span>
                      {haversineDistance(latitude, longitude, ghat.latitude, ghat.longitude).toFixed(1)} km away
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-3 mt-auto">
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="flex-1 glow-btn-primary font-bold text-xs py-2.5 rounded-xl text-center"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
