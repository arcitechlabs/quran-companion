import { Pause, Play, X, SkipForward, Repeat } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';

const AudioPlayer = () => {
  const { isPlaying, currentSurah, currentAyat, autoPlay, pause, resume, stop, toggleAutoPlay } = useAudioStore();

  if (currentSurah === null) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 px-4 max-w-lg mx-auto">
      <div className="bg-card border border-border rounded-xl shadow-lg p-3 flex items-center gap-3 animate-slide-up">
        <button
          onClick={isPlaying ? pause : resume}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 transition-transform active:scale-90"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            Surah {currentSurah} — Ayat {currentAyat}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center gap-1 text-xs transition-colors ${
                autoPlay ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Repeat className="w-3 h-3" />
              Auto-play {autoPlay ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <button
          onClick={stop}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
