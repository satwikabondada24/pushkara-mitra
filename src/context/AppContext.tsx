import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getDemoCrowdData, ghats as demoGhats, type Ghat, type GhatCrowdData } from '@/data/ghats';
import { hasSupabaseConfig, loadSupabaseGhatData } from '@/data/supabase';

const FAVORITES_KEY = 'pushkara-mitra-favorites';
const BOOKINGS_KEY = 'pushkara-mitra-bookings';
const USER_KEY = 'pushkara-mitra-user';

interface UserAuth {
  isLoggedIn: boolean;
  role: string;
  name: string;
  username: string;
}

export interface PilgrimBooking {
  id: string;
  pujaName: string;
  ghatId: string;
  scheduledAt: string;
  pilgrimCount: number;
  totalDakshina: number;
  status: 'CONFIRMED';
  createdAt: string;
}

interface AppContextType {
  ghats: Ghat[];
  crowdData: GhatCrowdData[];
  crowdDataSource: 'demo' | 'supabase';
  crowdDataError: string | null;
  refreshCrowdData: () => Promise<void>;
  userAuth: UserAuth;
  login: (name: string, username: string) => void;
  logout: () => void;
  favoriteIds: string[];
  bookings: PilgrimBooking[];
  createBooking: (booking: Omit<PilgrimBooking, 'id' | 'status' | 'createdAt'>) => string;
  isFavorite: (ghatId: string) => boolean;
  toggleFavorite: (ghatId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

function loadBookings(): PilgrimBooking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (booking): booking is PilgrimBooking =>
        typeof booking === 'object' &&
        booking !== null &&
        'id' in booking &&
        typeof booking.id === 'string' &&
        'pujaName' in booking &&
        typeof booking.pujaName === 'string' &&
        'ghatId' in booking &&
        typeof booking.ghatId === 'string' &&
        'scheduledAt' in booking &&
        typeof booking.scheduledAt === 'string' &&
        'pilgrimCount' in booking &&
        typeof booking.pilgrimCount === 'number' &&
        'totalDakshina' in booking &&
        typeof booking.totalDakshina === 'number' &&
        'status' in booking &&
        booking.status === 'CONFIRMED' &&
        'createdAt' in booking &&
        typeof booking.createdAt === 'string',
    );
  } catch {
    return [];
  }
}

function loadUser(): UserAuth {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return { isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim', username: '' };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'name' in parsed &&
      typeof parsed.name === 'string' &&
      'username' in parsed &&
      typeof parsed.username === 'string'
    ) {
      return { isLoggedIn: true, role: 'PILGRIM', name: parsed.name, username: parsed.username };
    }
  } catch {
    return { isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim', username: '' };
  }
  return { isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim', username: '' };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ghats, setGhats] = useState<Ghat[]>(demoGhats);
  const [crowdData, setCrowdData] = useState<GhatCrowdData[]>(() => getDemoCrowdData());
  const [crowdDataSource, setCrowdDataSource] = useState<'demo' | 'supabase'>('demo');
  const [crowdDataError, setCrowdDataError] = useState<string | null>(null);
  const [userAuth, setUserAuth] = useState<UserAuth>(loadUser);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavoriteIds);
  const [bookings, setBookings] = useState<PilgrimBooking[]>(loadBookings);

  const refreshCrowdData = async () => {
    if (!hasSupabaseConfig) {
      setCrowdDataError(null);
      return;
    }

    try {
      const data = await loadSupabaseGhatData();
      if (data.ghats.length === 0) throw new Error('Supabase returned no ghats.');
      setGhats(data.ghats);
      setCrowdData(data.crowdData);
      setCrowdDataSource('supabase');
      setCrowdDataError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Supabase data error.';
      setGhats(demoGhats);
      setCrowdData(getDemoCrowdData());
      setCrowdDataSource('demo');
      setCrowdDataError(`${message} Showing demo crowd data instead.`);
    }
  };

  useEffect(() => {
    void refreshCrowdData();
    if (!hasSupabaseConfig) return;
    const interval = window.setInterval(() => void refreshCrowdData(), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const login = (name: string, username: string) => {
    const user = { isLoggedIn: true, role: 'PILGRIM', name, username };
    localStorage.setItem(USER_KEY, JSON.stringify({ name, username }));
    setUserAuth(user);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUserAuth({ isLoggedIn: false, role: 'PILGRIM', name: 'Guest Pilgrim', username: '' });
  };

  const createBooking = (booking: Omit<PilgrimBooking, 'id' | 'status' | 'createdAt'>) => {
    const id = `PM-${Date.now().toString(36).toUpperCase()}`;
    setBookings((current) => [
      {
        ...booking,
        id,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    return id;
  };

  const isFavorite = (ghatId: string) => favoriteIds.includes(ghatId);

  const toggleFavorite = (ghatId: string) => {
    setFavoriteIds((current) =>
      current.includes(ghatId) ? current.filter((id) => id !== ghatId) : [...current, ghatId],
    );
  };

  return (
    <AppContext.Provider
      value={{
        ghats,
        crowdData,
        crowdDataSource,
        crowdDataError,
        refreshCrowdData,
        userAuth,
        login,
        logout,
        favoriteIds,
        bookings,
        createBooking,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
