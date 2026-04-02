import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentSurah: number | null;
  currentAyat: number | null;
  autoPlay: boolean;
  audioUrl: string | null;
  onAutoPlayNext: (() => void) | null;

  play: (surah: number, ayat: number, url: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleAutoPlay: () => void;
  setAutoPlayNext: (fn: (() => void) | null) => void;
}

let audioElement: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioElement) {
    audioElement = new Audio();
  }
  return audioElement;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  currentSurah: null,
  currentAyat: null,
  autoPlay: true,
  audioUrl: null,
  onAutoPlayNext: null,

  play: (surah, ayat, url) => {
    const audio = getAudio();
    audio.pause();
    audio.src = url;
    audio.play().catch(() => {});
    set({ isPlaying: true, currentSurah: surah, currentAyat: ayat, audioUrl: url });

    audio.onended = () => {
      const state = get();
      if (state.autoPlay && state.onAutoPlayNext) {
        state.onAutoPlayNext();
      } else {
        set({ isPlaying: false });
      }
    };
  },

  pause: () => {
    getAudio().pause();
    set({ isPlaying: false });
  },

  resume: () => {
    getAudio().play().catch(() => {});
    set({ isPlaying: true });
  },

  stop: () => {
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    set({ isPlaying: false, currentSurah: null, currentAyat: null, audioUrl: null });
  },

  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  setAutoPlayNext: (fn) => set({ onAutoPlayNext: fn }),
}));
