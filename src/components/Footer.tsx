import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1828] border-t border-[#1E3A54]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-heading font-black text-lg text-white tracking-wider">
              PUSHKARA MITRA
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital Pilgrim Management & Safety Ecosystem for Godavari Pushkaralu.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Pilgrim Services
            </h3>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><Link to="/ghats" className="hover:text-cyan-400 transition-colors">Explore Ghats</Link></li>
              <li><Link to="/pujas" className="hover:text-cyan-400 transition-colors">Devotional Pujas & Harati</Link></li>
              <li><Link to="/food" className="hover:text-cyan-400 transition-colors">Free Annadanam Directory</Link></li>
              <li><Link to="/safety" className="hover:text-cyan-400 transition-colors">Safety & Missing Person Reunification</Link></li>
              <li><Link to="/recommendation" className="hover:text-cyan-400 transition-colors">Smart Ghat Recommendation Engine</Link></li>
              <li><Link to="/crowd-map" className="hover:text-cyan-400 transition-colors">Ghat Crowd & Safety Map</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Emergency Helplines
            </h3>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Control Room: <strong className="text-white font-mono">1800-425-5555</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Medical Emergency: <strong className="text-rose-400 font-mono">108</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support@pushkaramitra.ap.gov.in</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Coverage Area
            </h3>
            <div className="space-y-2 text-slate-400 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                Rajamahendravaram (East Godavari)
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                Kovvur (West Godavari)
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                Pattiseema (West Godavari)
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E3A54] flex flex-col sm:flex-row justify-between items-center gap-4 text-[#64748B]">
          <p className="text-xs">© 2027 Pushkara Mitra Digital Ecosystem. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/safety" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/safety" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
