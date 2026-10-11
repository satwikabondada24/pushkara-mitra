import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [formError, setFormError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !passcode.trim()) {
      setFormError('Enter your name, email or phone, and a demo passcode to continue.');
      return;
    }
    setFormError('');
    login(name.trim(), username.trim());
    navigate('/pilgrim/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="dark-card p-8 border-[#1E3A54] bg-[#0D1F32] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">Pilgrim Access Login</h1>
          <p className="text-xs text-slate-400">Sign in to manage your bookings and passes.</p>
          <p className="text-xs text-amber-300">Demo sign-in only. No password is verified and no account is created.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">Pilgrim Full Name</label>
            <div className="flex items-center gap-2 bg-[#172A3A] border border-[#1E3A54] rounded-xl px-3">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 bg-transparent text-sm text-white py-2.5 outline-none placeholder-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">Username</label>
            <div className="flex items-center gap-2 bg-[#172A3A] border border-[#1E3A54] rounded-xl px-3">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Phone or email"
                className="flex-1 bg-transparent text-sm text-white py-2.5 outline-none placeholder-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">Passcode</label>
            <div className="flex items-center gap-2 bg-[#172A3A] border border-[#1E3A54] rounded-xl px-3">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="flex-1 bg-transparent text-sm text-white py-2.5 outline-none placeholder-slate-500"
              />
            </div>
          </div>

          {formError && <p role="alert" className="text-xs text-rose-300">{formError}</p>}
          <button type="submit" className="glow-btn-primary w-full py-3 text-sm">
            Continue in demo mode →
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Demo details stay on this device.{' '}
          <Link to="/pilgrim/dashboard" className="text-cyan-400 font-bold hover:underline">
            View dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
