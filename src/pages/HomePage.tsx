import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Hand, Target, Download, Wifi, WifiOff } from 'lucide-react';
import { getSurahs, isSynced, syncAllData } from '@/lib/api';
import { useAppStore } from '@/stores/appStore';

const HomePage = () => {
  const navigate = useNavigate();
  const { isOnline, isSynced: synced, setSynced, syncProgress, setSyncProgress } = useAppStore();
  const [syncing, setSyncing] = useState(false);
  const [surahCount, setSurahCount] = useState(0);

  useEffect(() => {
    isSynced().then(setSynced);
    getSurahs().then((s) => setSurahCount(s.length));
  }, [setSynced]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncAllData((p) => setSyncProgress(p));
      setSynced(true);
    } catch (e) {
      console.error('Sync failed:', e);
    }
    setSyncing(false);
  };

  const menuItems = [
    { icon: BookOpen, label: "Al-Qur'an", desc: '114 Surah', path: '/quran', color: 'bg-primary' },
    { icon: Clock, label: 'Jadwal Shalat', desc: 'Berdasarkan lokasi', path: '/prayer-times', color: 'bg-accent' },
    { icon: Hand, label: 'Dzikir Counter', desc: 'Tasbih digital', path: '/dzikir', color: 'bg-primary' },
    { icon: Target, label: 'Target Khatam', desc: 'Rencana bacaan', path: '/khatam', color: 'bg-accent' },
  ];

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-foreground">بِسْمِ ٱللَّٰهِ</h1>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-primary" /> : <WifiOff className="w-3.5 h-3.5 text-destructive" />}
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Aplikasi Al-Qur'an & Ibadah Harian</p>
      </div>

      {/* Sync Banner */}
      {!synced && (
        <button
          onClick={handleSync}
          disabled={syncing || !isOnline}
          className="w-full mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 transition-all active:scale-[0.98]"
        >
          <Download className={`w-5 h-5 text-primary ${syncing ? 'animate-bounce' : ''}`} />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-foreground">
              {syncing ? `Mengunduh data... ${syncProgress}%` : 'Unduh Data Offline'}
            </p>
            <p className="text-xs text-muted-foreground">
              {syncing ? 'Mohon tunggu, jangan tutup aplikasi' : `${surahCount}/114 surah tersedia`}
            </p>
          </div>
          {syncing && (
            <div className="w-10 h-10 relative">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" className="stroke-muted" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none" className="stroke-primary"
                  strokeWidth="3" strokeDasharray={`${syncProgress} 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </button>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="p-4 rounded-xl bg-card border border-border text-left transition-all active:scale-[0.97] hover:shadow-md animate-fade-in"
          >
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Last Read */}
      {synced && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10">
          <p className="text-xs text-muted-foreground mb-1">Terakhir Dibaca</p>
          <p className="text-sm font-semibold text-foreground">Al-Fatihah - Ayat 1</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
