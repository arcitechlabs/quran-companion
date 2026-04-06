import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentSurah: number | null;
  currentAyat: number | null;
  autoPlay: boolean;
  audioUrl: string | null;
  onAutoPlayNext: (() => void) | null;
  reciter: string;
  speed: number;
  repeat: number; // 0 = no repeat, 1 = repeat once, -1 = repeat forever

  play: (surah: number, ayat: number, url: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleAutoPlay: () => void;
  setAutoPlayNext: (fn: (() => void) | null) => void;
  setReciter: (reciter: string) => void;
  setSpeed: (speed: number) => void;
  setRepeat: (repeat: number) => void;
}

const RECITERS = [
  { id: 'Abdul_Basit_Murattal_64kbps', name: 'Abdul Basit' },
  { id: 'Alafasy_64kbps', name: 'Mishary Rashid Alafasy' },
  { id: 'Husary_64kbps', name: 'Mahmoud Khalil Al-Husary' },
  { id: 'Minshawy_Murattal_64kbps', name: 'Mohamed Siddiq Al-Minshawy' },
  { id: 'Saood_24kbps', name: 'Saood bin Ibrahim Ash-Shuraym' },
];

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
  reciter: 'Abdul_Basit_Murattal_64kbps',
  speed: 1,
  repeat: 0,

  play: (surah, ayat, url) => {
    const audio = getAudio();
    const state = get();
    audio.pause();
    audio.src = url;
    audio.playbackRate = state.speed;
    audio.loop = state.repeat === -1;
    audio.play().catch(() => {});
    set({ isPlaying: true, currentSurah: surah, currentAyat: ayat, audioUrl: url });

    audio.onended = () => {
      const state = get();
      if (state.repeat > 0) {
        set({ repeat: state.repeat - 1 });
        audio.play().catch(() => {});
        return;
      }
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
    audio.currentTime = 0;
    set({ isPlaying: false, currentSurah: null, currentAyat: null, audioUrl: null });
  },

  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  setAutoPlayNext: (fn) => set({ onAutoPlayNext: fn }),
  setReciter: (reciter) => set({ reciter }),
  setSpeed: (speed) => {
    set({ speed });
    getAudio().playbackRate = speed;
  },
  setRepeat: (repeat) => {
    set({ repeat });
    getAudio().loop = repeat === -1;
  },
}));

export { RECITERS };
