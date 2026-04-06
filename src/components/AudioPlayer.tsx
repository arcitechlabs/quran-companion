import { Pause, Play, X, SkipForward, Repeat, RotateCcw } from 'lucide-react';
import { useAudioStore, RECITERS } from '@/stores/audioStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const AudioPlayer = () => {
  const { 
    isPlaying, 
    currentSurah, 
    currentAyat, 
    autoPlay, 
    pause, 
    resume, 
    stop, 
    toggleAutoPlay,
    reciter,
    speed,
    repeat,
    setReciter,
    setSpeed,
    setRepeat
  } = useAudioStore();

  if (currentSurah === null) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 px-4 max-w-lg mx-auto">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4 space-y-3 animate-slide-up">
        {/* Main controls */}
        <div className="flex items-center gap-3">
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

        {/* Reciter selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Reciter:</span>
          <Select value={reciter} onValueChange={setReciter}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RECITERS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">{speed}x</span>
        </div>

        {/* Repeat control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Repeat:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setRepeat(0)}
              className={`px-2 py-1 text-xs rounded ${repeat === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Off
            </button>
            <button
              onClick={() => setRepeat(1)}
              className={`px-2 py-1 text-xs rounded ${repeat === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              1x
            </button>
            <button
              onClick={() => setRepeat(-1)}
              className={`px-2 py-1 text-xs rounded ${repeat === -1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              ∞
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
