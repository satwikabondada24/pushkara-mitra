import { Waves } from 'lucide-react';

interface LogoProps {
  className?: string;
  isLightBg?: boolean;
}

export default function Logo({ className = 'w-9 h-9', isLightBg = true }: LogoProps) {
  return (
    <div
      className={`${className} relative flex items-center justify-center rounded-xl ${
        isLightBg
          ? 'bg-gradient-to-br from-godavari-500 to-godavari-700'
          : 'bg-gradient-to-br from-cyan-400 to-godavari-600'
      } shadow-lg`}
    >
      <Waves className="w-1/2 h-1/2 text-white" strokeWidth={2.5} />
      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-saffron-500 rounded-full border border-white/40" />
    </div>
  );
}
