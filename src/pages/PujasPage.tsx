import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin, Clock, CalendarCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const pujas = [
  { name: 'Maha Rudrabhishekam', seva: 'Standard', dakshina: 51, duration: '45 min', description: 'Sacred Lord Shiva abhishekam with 11 priest recitations.' },
  { name: 'Godavari Maha Harati', seva: 'VIP', dakshina: 101, duration: '30 min', description: 'Grand evening aarti at the Godavari riverbank with 108 lamps.' },
  { name: 'Ancestral Ritual (Pinda Pradanam)', seva: 'Standard', dakshina: 31, duration: '60 min', description: 'Ancestral rites for departed souls at the holy ghats.' },
  { name: 'Maha Yagnam', seva: 'VIP', dakshina: 251, duration: '90 min', description: 'Grand fire ritual with Vedic chanting for family prosperity.' },
  { name: 'Shiva Ritual (Laghu Abhishekam)', seva: 'Standard', dakshina: 21, duration: '20 min', description: 'Shorter abhishekam ideal for individual pilgrims.' },
  { name: 'Evening Aarti', seva: 'Free', dakshina: 0, duration: '15 min', description: 'Daily sunset aarti open to all pilgrims at Pushkar Ghat.' },
];

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function PujasPage() {
  const { ghats, createBooking } = useApp();
  const [selectedPuja, setSelectedPuja] = useState<(typeof pujas)[number] | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [ghatId, setGhatId] = useState(ghats[0]?.id ?? '');
  const [pilgrimCount, setPilgrimCount] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingReference, setBookingReference] = useState('');

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPuja || !ghats.some((ghat) => ghat.id === ghatId)) {
      setBookingError('Choose a valid ghat to continue.');
      return;
    }
    if (!bookingDate || bookingDate < getLocalDateString(new Date())) {
      setBookingError('Choose today or a future date.');
      return;
    }

    const id = createBooking({
      pujaName: selectedPuja.name,
      ghatId,
      scheduledAt: bookingDate,
      pilgrimCount,
      totalDakshina: selectedPuja.dakshina * pilgrimCount,
    });
    setBookingReference(id);
    setBookingError('');
    setSelectedPuja(null);
    setBookingDate('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-bold">
          <Flame className="w-4 h-4" /> Devotional Pujas & Harati
        </div>
        <h1 className="font-heading font-black text-3xl text-navy-900">Devotional Rituals Database</h1>
        <p className="text-slate-600 text-sm">
          Reserve a demo seva booking at a selected ghat. No payment is collected.
        </p>
        <p className="text-[10px] text-amber-700">Demo mode — bookings are saved only in this browser.</p>
      </div>
      {bookingReference && (
        <div role="status" className="white-card p-4 border-emerald-200 bg-emerald-50 text-sm text-emerald-800">
          Demo booking confirmed. Reference: <strong>{bookingReference}</strong>.{' '}
          <Link to="/pilgrim/dashboard" className="font-bold underline">View dashboard</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pujas.map((puja) => (
          <div key={puja.name} className="white-card p-5 border-gray-custom bg-white space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-heading font-bold text-lg text-navy-900">{puja.name}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  puja.seva === 'VIP'
                    ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                    : puja.seva === 'Free'
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-cyan-500/15 text-cyan-600 border border-cyan-500/30'
                }`}
              >
                {puja.seva}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{puja.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {puja.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Pushkar Ghat
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-sm font-bold text-navy-900">
                {puja.dakshina === 0 ? 'FREE' : `₹${puja.dakshina}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPuja(puja);
                  setBookingReference('');
                  setBookingError('');
                }}
                className="glow-btn-saffron px-4 py-2 text-xs"
              >
                Book Puja →
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedPuja && (
        <form onSubmit={submitBooking} className="dark-card p-6 sm:p-8 border-[#1E3A54] bg-[#0D1F32] space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-white">Reserve {selectedPuja.name}</h2>
              <p className="text-xs text-slate-400">Demo reservation · no payment or priest availability verification</p>
            </div>
            <button type="button" onClick={() => setSelectedPuja(null)} className="text-xs text-slate-300 hover:text-white">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="space-y-1 text-xs text-slate-300">
              <span>Ghat</span>
              <select value={ghatId} onChange={(event) => setGhatId(event.target.value)} required className="w-full rounded-lg border border-slate-600 bg-[#172A3A] px-3 py-2.5 text-white">
                {ghats.map((ghat) => <option key={ghat.id} value={ghat.id}>{ghat.name}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs text-slate-300">
              <span>Date</span>
              <input type="date" value={bookingDate} onChange={(event) => setBookingDate(event.target.value)} min={getLocalDateString(new Date())} required className="w-full rounded-lg border border-slate-600 bg-[#172A3A] px-3 py-2 text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-300">
              <span>Number of pilgrims</span>
              <input type="number" min="1" max="20" value={pilgrimCount} onChange={(event) => setPilgrimCount(Number(event.target.value))} required className="w-full rounded-lg border border-slate-600 bg-[#172A3A] px-3 py-2 text-white" />
            </label>
          </div>
          {bookingError && <p role="alert" className="text-sm text-rose-300">{bookingError}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300">
              Indicative dakshina: <strong className="text-white">₹{selectedPuja.dakshina * pilgrimCount}</strong>
            </p>
            <button type="submit" className="glow-btn-saffron px-5 py-3 text-sm inline-flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" /> Confirm demo booking
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
