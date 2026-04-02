import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  isOnline: boolean;
  isSynced: boolean;
  syncProgress: number;
  currentTab: string;
  notificationsEnabled: boolean;
  setDarkMode: (v: boolean) => void;
  setOnline: (v: boolean) => void;
  setSynced: (v: boolean) => void;
  setSyncProgress: (v: number) => void;
  setCurrentTab: (v: string) => void;
  setNotificationsEnabled: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isOnline: navigator.onLine,
  isSynced: false,
  syncProgress: 0,
  currentTab: 'home',
  notificationsEnabled: localStorage.getItem('prayerNotificationsEnabled') === 'true',
  setDarkMode: (v) => set({ isDarkMode: v }),
  setOnline: (v) => set({ isOnline: v }),
  setSynced: (v) => set({ isSynced: v }),
  setSyncProgress: (v) => set({ syncProgress: v }),
  setCurrentTab: (v) => set({ currentTab: v }),
  setNotificationsEnabled: (v) => {
    localStorage.setItem('prayerNotificationsEnabled', String(v));
    set({ notificationsEnabled: v });
  },
}));
