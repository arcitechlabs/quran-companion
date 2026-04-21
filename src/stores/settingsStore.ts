import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  arabicFontSize: number;
  latinFontSize: number;
  translationFontSize: number;
  showLatin: boolean;
  showTranslation: boolean;
  arabicFontFamily: 'lpmq' | 'uthmani';
  setArabicFontSize: (size: number) => void;
  setLatinFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setShowLatin: (show: boolean) => void;
  setShowTranslation: (show: boolean) => void;
  setArabicFontFamily: (font: 'lpmq' | 'uthmani') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      arabicFontSize: 24, // 24px default (xl-2xl approx)
      latinFontSize: 14,
      translationFontSize: 14,
      showLatin: true,
      showTranslation: true,
      arabicFontFamily: 'lpmq',
      
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      setLatinFontSize: (size) => set({ latinFontSize: size }),
      setTranslationFontSize: (size) => set({ translationFontSize: size }),
      setShowLatin: (show) => set({ showLatin: show }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setArabicFontFamily: (font) => set({ arabicFontFamily: font }),
    }),
    {
      name: 'quran-settings',
    }
  )
);
