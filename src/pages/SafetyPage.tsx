import { Shield, Phone, AlertTriangle, Search, MapPin } from 'lucide-react';

const mockCases = [
  {
    caseId: 'MP-2027-10482',
    personName: 'Subba Rao Pasupuleti',
    age: 68,
    gender: 'Male',
    lastSeenGhat: 'Pushkar Ghat',
    lastKnownLocation: 'Near Changing Room Gate #3',
    lastSeenTime: '07:15 AM',
    clothing: 'White Cotton Dhoti and Yellow Kanduva',
    features: 'Wears black-framed reading glasses, speaks Telugu, slight limp on left leg',
    status: 'ALERT_BROADCASTED',
    reporter: 'Venkateswara Rao (Son)',
    reporterPhone: '+91 98490 55443',
  },
  {
    caseId: 'MP-2027-10491',
    personName: 'Sita Ramaiah',
    age: 72,
    gender: 'Female',
    lastSeenGhat: 'Saraswati Ghat',
    lastKnownLocation: 'Near Saraswati Ghat Mandapam',
    lastSeenTime: '08:45 AM',
    clothing: 'Pink Frock with floral pattern',
    features: 'Speaks Telugu, walks with cane',
    status: 'OPEN',
    reporter: 'Kalyan Varma (Grandson)',
    reporterPhone: '+91 98480 99887',
  },
];

export default function SafetyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold">
          <Shield className="w-4 h-4" /> Safety & Missing Person Reunification
        </div>
        <h1 className="font-heading font-black text-3xl text-navy-900">Safety Center</h1>
        <p className="text-slate-600 text-sm">
          Report and track missing person cases. Integrated with control room alert broadcasting.
        </p>
      </div>

      {/* Emergency helplines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="white-card p-5 border-gray-custom bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-cyan-500" />
          </div>
          <h3 className="font-heading font-bold text-sm text-navy-900">Control Room</h3>
          <p className="text-2xl font-mono font-bold text-cyan-600">1800-425-5555</p>
          <p className="text-xs text-slate-500">24/7 Pushkaralu Operations Command Center</p>
        </div>
        <div className="white-card p-5 border-gray-custom bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="font-heading font-bold text-sm text-navy-900">Medical Emergency</h3>
          <p className="text-2xl font-mono font-bold text-rose-500">108</p>
          <p className="text-xs text-slate-500">Ambulance & Medical Response</p>
        </div>
        <div className="white-card p-5 border-gray-custom bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="font-heading font-bold text-sm text-navy-900">Missing Person Desk</h3>
          <p className="text-2xl font-mono font-bold text-emerald-600">1800-425-5566</p>
          <p className="text-xs text-slate-500">Reunification Helpdesk</p>
        </div>
      </div>

      {/* Missing person cases */}
      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-navy-900 border-b border-slate-100 pb-2">
          Active Missing Person Cases
        </h2>
        {mockCases.map((c) => (
          <div key={c.caseId} className="white-card p-5 border-gray-custom bg-white space-y-3">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-lg">
                  {c.personName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-navy-900">{c.personName}</h3>
                  <span className="text-xs text-slate-500">
                    {c.age} yrs • {c.gender} • Case #{c.caseId}
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  c.status === 'ALERT_BROADCASTED'
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                }`}
              >
                {c.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Last Seen</span>
                <span className="text-navy-900 font-bold">{c.lastSeenGhat}</span>
                <span className="text-slate-600 block text-[11px]">{c.lastKnownLocation}</span>
                <span className="text-slate-500 block text-[11px]">Time: {c.lastSeenTime}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Clothing</span>
                <span className="text-navy-900 block">{c.clothing}</span>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold mt-1">Features</span>
                <span className="text-slate-600 block text-[11px]">{c.features}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Reported by {c.reporter} — {c.reporterPhone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
