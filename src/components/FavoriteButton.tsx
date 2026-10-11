import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface FavoriteButtonProps {
  ghatId: string;
  ghatName: string;
  variant?: 'overlay' | 'solid';
}

export default function FavoriteButton({ ghatId, ghatName, variant = 'overlay' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useApp();
  const saved = isFavorite(ghatId);

  const overlayClass = saved
    ? 'bg-rose-500/90 text-white border-rose-400'
    : 'bg-[#0D1F32]/80 text-white border-white/20 hover:border-rose-300 hover:text-rose-200';

  const solidClass = saved
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
    : 'bg-[#172A3A] text-slate-300 border-[#1E3A54] hover:border-rose-400/50 hover:text-rose-300';

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(ghatId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${ghatName} from saved ghats` : `Save ${ghatName}`}
      title={saved ? 'Saved — click to remove' : 'Save this ghat'}
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${
        variant === 'overlay' ? `h-9 w-9 ${overlayClass}` : `h-10 gap-2 px-3 ${solidClass}`
      }`}
    >
      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      {variant === 'solid' && (
        <span className="text-xs font-bold">{saved ? 'Saved' : 'Save ghat'}</span>
      )}
    </button>
  );
}
