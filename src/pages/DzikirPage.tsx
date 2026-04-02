import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const DzikirPage = () => {
  const [count, setCount] = useState(0);
  const [target] = useState(33);
  const [ripple, setRipple] = useState(false);
  const [selectedDzikir, setSelectedDzikir] = useState(0);

  const dzikirList = [
    { name: 'Subhanallah', arabic: 'سُبْحَانَ اللَّهِ', target: 33 },
    { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', target: 33 },
    { name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', target: 33 },
    { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', target: 100 },
  ];

  const current = dzikirList[selectedDzikir];

  const handleTap = useCallback(() => {
    setCount((c) => c + 1);
    setRipple(true);

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    setTimeout(() => setRipple(false), 300);
  }, []);

  const handleReset = () => setCount(0);

  const progress = Math.min((count / current.target) * 100, 100);

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 flex flex-col">
      <h1 className="text-xl font-bold text-foreground mb-4">Dzikir Counter</h1>

      {/* Dzikir Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {dzikirList.map((d, i) => (
          <button
            key={i}
            onClick={() => { setSelectedDzikir(i); setCount(0); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              i === selectedDzikir
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Counter Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="font-arabic text-3xl text-primary mb-2">{current.arabic}</p>
        <p className="text-sm text-muted-foreground mb-8">{current.name}</p>

        {/* Tap Button */}
        <div className="relative mb-8">
          <button
            onClick={handleTap}
            className="relative w-44 h-44 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg transition-transform active:scale-95"
          >
            {ripple && (
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-ring" />
            )}
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-foreground">{count}</p>
              <p className="text-xs text-primary-foreground/70 mt-1">/ {current.target}</p>
            </div>
          </button>
        </div>

        {/* Progress */}
        <div className="w-full max-w-xs mb-4">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
            <p className="text-xs text-muted-foreground">{count}/{current.target}</p>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        {count >= current.target && (
          <p className="mt-4 text-sm text-primary font-semibold animate-fade-in">
            ✨ Alhamdulillah, selesai!
          </p>
        )}
      </div>
    </div>
  );
};

export default DzikirPage;
