import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getStatusText, findRecommendedGhat } from '@/data/ghats';

export default function RecommendationPage() {
  const { ghats, crowdData, crowdDataSource, crowdDataError } = useApp();
  const recommendedGhats = ghats
    .map((ghat) => ({
      ghat,
      crowd: crowdData.find((item) => item.ghatId === ghat.id),
    }))
    .filter((item) => item.crowd?.crowdLevel === 'LOW')
    .sort((a, b) => (a.crowd?.crowdPercentage ?? 100) - (b.crowd?.crowdPercentage ?? 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-softblue border border-blue-200 text-godavari text-xs font-bold">
          <Sparkles className="w-4 h-4 text-godavari" /> Smart Recommendation Engine
        </div>
        <h1 className="font-heading font-black text-3xl text-navy-900">Smart Ghat Recommendation</h1>
        <p className="text-slate-600 text-sm">
          Explainable AI recommendation wizard to find peaceful ghats with low crowd density.
        </p>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-[10px] text-slate-500">
          Crowd data: {crowdDataSource === 'supabase' ? 'Supabase' : 'Demo sample'}
        </p>
        {crowdDataError && <p role="status" className="text-xs text-amber-700">{crowdDataError}</p>}
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-base text-navy-900 border-b border-slate-100 pb-2">
          Top Recommended Ghats For You
        </h2>
        {recommendedGhats.length === 0 && (
          <p className="white-card p-5 text-sm text-slate-600">
            No ghats are currently below the low-crowd threshold. Check the crowd map for the latest status before traveling.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedGhats.map(({ ghat, crowd }) => {
            return (
              <div
                key={ghat.id}
                className="white-card p-6 border-gray-custom space-y-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-godavari uppercase">{ghat.city}</span>
                    <h3 className="font-heading font-bold text-xl text-navy-900">{ghat.name}</h3>
                  </div>
                  {crowd && (
                    <span className={`${crowd?.crowdLevel === 'LOW' ? 'badge-status-low' : 'badge-status-med'} px-2.5 py-0.5 rounded-full text-xs font-bold`}>
                      {getStatusText(crowd.crowdLevel)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ghat.description}</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-navy-900 block">Why recommended:</span>
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Effective capacity of {ghat.effectiveCapacity.toLocaleString()} pilgrims
                  </span>
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Lowest current crowd density ({crowd?.crowdPercentage}% occupancy)
                  </span>
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${ghat.hasWheelchairRamp ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {ghat.hasWheelchairRamp ? 'Wheelchair ramp available' : 'No wheelchair ramp listed'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/ghats/${ghat.id}`}
                    className="flex-1 bg-godavari hover:bg-godavari-600 text-white font-bold text-xs py-2.5 rounded-xl text-center block shadow-sm"
                  >
                    View Details →
                  </Link>
                  <Link
                    to={`/crowd-map?ghat=${encodeURIComponent(ghat.id)}`}
                    className="bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs py-2.5 px-4 rounded-xl text-center block transition-colors"
                  >
                    View on Map
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High crowd alert + recommendation */}
      <div className="space-y-4">
        <h2 className="font-bold text-base text-navy-900 border-b border-slate-100 pb-2">
          Active Crowd Alerts & Alternative Recommendations
        </h2>
        {crowdData
          .filter((d) => d.crowdLevel === 'HIGH')
          .map((d) => {
            const rec = findRecommendedGhat(d.ghatId, crowdData, ghats);
            if (!rec) return null;
            return (
              <div key={d.ghatId} className="white-card p-6 border-gray-custom space-y-4 shadow-sm bg-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-lg text-navy-900">{d.name}</h3>
                    <span className="badge-status-critical px-2.5 py-0.5 rounded-full text-xs font-bold inline-block mt-1">
                      {getStatusText(d.crowdLevel)} — {d.crowdPercentage}%
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <ArrowRight className="w-4 h-4" /> Recommended Alternative Nearby Ghat
                  </div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-bold text-godavari uppercase">{rec.ghat.city}</span>
                      <h4 className="font-heading font-bold text-xl text-navy-900">{rec.ghat.name}</h4>
                    </div>
                    <span className={`${rec.crowdData.crowdLevel === 'LOW' ? 'badge-status-low' : 'badge-status-med'} px-2.5 py-0.5 rounded-full text-xs font-bold`}>
                      {getStatusText(rec.crowdData.crowdLevel)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase">Distance</span>
                      <span className="font-mono font-bold text-navy-900">
                        {rec.distanceM >= 1000 ? `${(rec.distanceM / 1000).toFixed(1)} km` : `${rec.distanceM} m`}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase">Crowd</span>
                      <span className={`font-mono font-bold ${rec.crowdData.crowdLevel === 'LOW' ? 'text-emerald-600' : 'text-amber-600'}`}>{rec.crowdData.crowdPercentage}%</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] uppercase">Risk</span>
                      <span className={`font-mono font-bold ${rec.crowdData.riskLevel === 'SAFE' ? 'text-emerald-600' : 'text-amber-600'}`}>{rec.crowdData.riskLevel}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/ghats/${rec.ghat.id}`}
                      className="flex-1 bg-godavari hover:bg-godavari-600 text-white font-bold text-xs py-2.5 rounded-xl text-center block"
                    >
                      View Ghat Details →
                    </Link>
                    <Link
                      to={`/crowd-map?ghat=${encodeURIComponent(d.ghatId)}`}
                      className="bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs py-2.5 px-4 rounded-xl text-center block"
                    >
                      View Route
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
