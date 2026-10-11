import { Utensils, MapPin, Clock } from 'lucide-react';

const foodCenters = [
  { name: 'TTD Annaprasadam Complex', location: 'Pushkar Ghat Gate #3', type: 'Free Annadanam', timing: '12:00 PM - 10:00 PM', distance: '200 m' },
  { name: 'Sri Subrahmanya Annadana Chhatram', location: 'Kotilingala Revu Road', type: 'Free Annadanam', timing: '11:00 AM - 9:00 PM', distance: '450 m' },
  { name: 'Godavari Grand Andhra Meals', location: 'Godavari Bund Road', type: 'Paid Restaurant', timing: '8:00 AM - 10:00 PM', distance: '800 m' },
  { name: 'Sri Annapurna Tiffin Center', location: 'Gowthami Ghat Road', type: 'Budget Tiffin', timing: '6:00 AM - 10:00 PM', distance: '650 m' },
  { name: 'Godavari Spice Pure Veg', location: 'Near Pushkar Ghat Main Road', type: 'Pure Veg', timing: '7:00 AM - 11:00 PM', distance: '1.2 km' },
  { name: 'Kovvur Goshpada Family Dining', location: 'Goshpada Kshetram Temple Road', type: 'Family Restaurant', timing: '8:00 AM - 10:00 PM', distance: '1.5 km' },
  { name: 'Pattiseema Temple Prasadam Center', location: 'Pattiseema', type: 'Prasadam', timing: '9:00 AM - 6:00 PM', distance: '3 km' },
  { name: 'Godavari Street Snacks Corner', location: 'Saraswati Ghat Temple Complex', type: 'Street Food', timing: '4:00 PM - 10:00 PM', distance: '500 m' },
];

export default function FoodPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold">
          <Utensils className="w-4 h-4" /> Free Annadanam Directory
        </div>
        <h1 className="font-heading font-black text-3xl text-navy-900">Find Food Near Me</h1>
        <p className="text-slate-600 text-sm">
          Locate free meal centers (Annadanam), prasadam distribution, and pure veg restaurants near the ghats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foodCenters.map((f) => (
          <div key={f.name} className="white-card p-5 border-gray-custom bg-white space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-heading font-bold text-base text-navy-900">{f.name}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  f.type.includes('Free')
                    ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                    : 'bg-cyan-500/15 text-cyan-600 border border-cyan-500/30'
                }`}
              >
                {f.type}
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {f.location}
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {f.timing}
              </p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-godavari">{f.distance} away</span>
              <button className="text-xs font-bold text-cyan-600 hover:underline">Directions →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
