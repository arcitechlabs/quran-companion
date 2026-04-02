import { create } from 'zustand';

interface AppState {
  isDarkMode: boolean;
  isOnline: boolean;
  isSynced: boolean;
  syncProgress: number;
  currentTab: string;
  setDarkMode: (v: boolean) => void;
  setOnline: (v: boolean) => void;
  setSynced: (v: boolean) => void;
  setSyncProgress: (v: number) => void;
  setCurrentTab: (v: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isOnline: navigator.onLine,
  isSynced: false,
  syncProgress: 0,
  currentTab: 'home',
  setDarkMode: (v) => set({ isDarkMode: v }),
  setOnline: (v) => set({ isOnline: v }),
  setSynced: (v) => set({ isSynced: v }),
  setSyncProgress: (v) => set({ syncProgress: v }),
  setCurrentTab: (v) => set({ currentTab: v }),
}));
