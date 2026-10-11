import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  LogOut,
  Waves,
  Utensils,
  Shield,
  Calendar,
  Heart,
  Map as MapIcon,
} from 'lucide-react';
import Logo from './Logo';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { favoriteIds, userAuth, logout } = useApp();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ghats', label: 'Explore Ghats' },
    { to: '/pujas', label: 'Devotional Pujas', icon: 'puja' },
    { to: '/food', label: 'Find Food', icon: 'food' },
    { to: '/crowd-map', label: 'Crowd & Safety Map', icon: 'map' },
    { to: '/safety', label: 'Safety Center', icon: 'safety' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-[1000] bg-[#0D1F32] border-b border-[#1E3A54] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group"
            onClick={() => setMobileOpen(false)}
          >
            <Logo className="w-9 h-9 transition-transform group-hover:scale-105" isLightBg={false} />
            <div>
              <span className="font-heading font-black text-lg sm:text-xl tracking-wider text-white block leading-tight">
                PUSHKARA MITRA
              </span>
              <span className="text-[10px] text-cyan-400 font-medium block">
                Digital Pilgrim Ecosystem
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold whitespace-nowrap">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              if (link.to === '/pujas') {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors hover:text-amber-400 flex items-center gap-1 ${
                      active ? 'text-amber-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Waves className="w-3.5 h-3.5 text-amber-400" />
                    {link.label}
                  </Link>
                );
              }
              if (link.to === '/food') {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors hover:text-emerald-400 flex items-center gap-1 ${
                      active ? 'text-emerald-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                    {link.label}
                  </Link>
                );
              }
              if (link.to === '/crowd-map') {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors hover:text-cyan-400 flex items-center gap-1 ${
                      active ? 'text-cyan-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
                    {link.label}
                  </Link>
                );
              }
              if (link.to === '/safety') {
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`transition-colors hover:text-rose-400 flex items-center gap-1 ${
                      active ? 'text-rose-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-rose-400" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-colors hover:text-cyan-400 ${
                    active ? 'text-cyan-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/ghats?saved=true"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all whitespace-nowrap flex items-center gap-1"
            >
              <Heart className={`w-3.5 h-3.5 ${favoriteIds.length > 0 ? 'fill-current' : ''}`} />
              Saved{favoriteIds.length > 0 ? ` ${favoriteIds.length}` : ''}
            </Link>
            <Link
              to="/recommendation"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all whitespace-nowrap flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              Smart Ghat
            </Link>
            <Link
              to={userAuth.isLoggedIn ? '/pilgrim/dashboard' : '/pilgrim/login'}
              className="glow-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
            >
              {userAuth.isLoggedIn ? 'Dashboard' : <><LogIn className="w-3.5 h-3.5" /> Demo Login</>}
            </Link>
            {userAuth.isLoggedIn && (
              <button type="button" onClick={logout} className="px-2 py-2 text-xs text-slate-300 hover:text-white" aria-label="Sign out of demo session">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-xl bg-[#172A3A] text-slate-200 border border-[#1E3A54]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-[#0D1F32] border-t border-[#1E3A54] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm font-semibold transition-colors ${
                isActive(link.to) ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/ghats?saved=true"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-rose-300"
          >
            Saved Ghats{favoriteIds.length > 0 ? ` (${favoriteIds.length})` : ''}
          </Link>
          <Link
            to="/recommendation"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-semibold text-cyan-400"
          >
            Smart Ghat Recommendation
          </Link>
          <Link
            to={userAuth.isLoggedIn ? '/pilgrim/dashboard' : '/pilgrim/login'}
            onClick={() => setMobileOpen(false)}
            className="glow-btn-primary w-full py-3 text-xs text-center flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {userAuth.isLoggedIn ? 'Dashboard' : 'Demo Login'}
          </Link>
          {userAuth.isLoggedIn && (
            <button
              type="button"
              onClick={() => { logout(); setMobileOpen(false); }}
              className="w-full py-2 text-sm font-semibold text-slate-300"
            >
              Sign out of demo session
            </button>
          )}
        </div>
      )}
    </header>
  );
}
