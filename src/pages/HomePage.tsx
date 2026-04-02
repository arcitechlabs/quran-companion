import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Hand, Target, Download, Wifi, WifiOff, BookmarkCheck, ChevronRight, Compass, TextSearch, CalendarDays, Coins, Moon } from 'lucide-react';
import { getSurahs, isSynced, syncAllData } from '@/lib/api';
import { db } from '@/lib/db';
import type { Bookmark, Surah } from '@/lib/db';
import { useAppStore } from '@/stores/appStore';

const TOTAL_AYAT = 6236;

// Cumulative ayat count up to (but not including) each surah
const SURAH_AYAT_CUMULATIVE: Record<number, number> = {};
const SURAH_AYAT_COUNTS = [
  7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,
  112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,
  89,59,33,46,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,
  12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,
  20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6
];
let cumulative = 0;
SURAH_AYAT_COUNTS.forEach((count, i) => {
  SURAH_AYAT_CUMULATIVE[i + 1] = cumulative;
  cumulative += count;
});

function calculateGlobalAyat(surahNomor: number, ayat: number): number {
  return (SURAH_AYAT_CUMULATIVE[surahNomor] || 0) + ayat;
}

function findSurahFromGlobal(globalAyat: number): { surah: number; ayat: number } {
  let remaining = globalAyat;
  for (let i = 0; i < SURAH_AYAT_COUNTS.length; i++) {
    if (remaining <= SURAH_AYAT_COUNTS[i]) {
      return { surah: i + 1, ayat: remaining };
    }
    remaining -= SURAH_AYAT_COUNTS[i];
  }
  return { surah: 114, ayat: 6 };
}

const HomePage = () => {
  const navigate = useNavigate();
  const { isOnline, isSynced: synced, setSynced, syncProgress, setSyncProgress } = useAppStore();
  const [syncing, setSyncing] = useState(false);
  const [surahCount, setSurahCount] = useState(0);
  const [lastRead, setLastRead] = useState<Bookmark | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [khatamProgress, setKhatamProgress] = useState<number>(0);
  const [khatamJuz, setKhatamJuz] = useState<string>('');

  useEffect(() => {
    isSynced().then(setSynced);
    getSurahs().then((s) => setSurahCount(s.length));
    loadData();
  }, [setSynced]);

  const loadData = async () => {
    // Last read
    const lr = await db.bookmarks.where('isLastRead').equals(1).first();
    setLastRead(lr || null);

    // Calculate khatam progress from last read
    if (lr) {
      const globalAyat = calculateGlobalAyat(lr.surahNomor, lr.nomorAyat);
      const pct = Math.round((globalAyat / TOTAL_AYAT) * 100 * 10) / 10;
      setKhatamProgress(pct);
      // Estimate juz (roughly 1 juz = ~20 pages ≈ TOTAL_AYAT/30)
      const juz = Math.ceil(globalAyat / (TOTAL_AYAT / 30));
      setKhatamJuz(`Juz ${Math.min(juz, 30)}`);
    }

    // Bookmarks
    const bmarks = await db.bookmarks.filter(b => !b.isLastRead).reverse().sortBy('createdAt');
    setBookmarks(bmarks.slice(0, 5));
  };

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
    { icon: TextSearch, label: 'Cari Ayat', desc: 'Pencarian full-text', path: '/search', color: 'bg-primary' },
    { icon: Compass, label: 'Arah Kiblat', desc: 'Kompas digital', path: '/qibla', color: 'bg-accent' },
    { icon: CalendarDays, label: 'Kalender Hijriyah', desc: 'Hari penting Islam', path: '/hijriah', color: 'bg-primary' },
    { icon: Coins, label: 'Kalkulator Zakat', desc: 'Maal & Fitrah', path: '/zakat', color: 'bg-accent' },
    { icon: Moon, label: 'Jadwal Shaum', desc: 'Puasa & alarm sahur', path: '/fasting', color: 'bg-primary' },
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
                <circle cx="18" cy="18" r="15" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray={`${syncProgress} 100`} strokeLinecap="round" />
              </svg>
            </div>
          )}
        </button>
      )}

      {/* Khatam Progress Card */}
      {lastRead && (
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/15 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progres Khatam Al-Qur'an</p>
                <p className="text-lg font-bold text-foreground">{khatamProgress}%</p>
              </div>
            </div>
            <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">{khatamJuz}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{ width: `${Math.min(khatamProgress, 100)}%` }}
            />
          </div>

          {/* Last read info */}
          <button
            onClick={() => navigate(`/quran/${lastRead.surahNomor}`)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-card/60 border border-border/50 transition-all active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Terakhir Dibaca</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {lastRead.surahNamaLatin} — Ayat {lastRead.nomorAyat}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>

          {/* Stats row */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{calculateGlobalAyat(lastRead.surahNomor, lastRead.nomorAyat)}</p>
              <p className="text-[10px] text-muted-foreground">Ayat dibaca</p>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{TOTAL_AYAT - calculateGlobalAyat(lastRead.surahNomor, lastRead.nomorAyat)}</p>
              <p className="text-[10px] text-muted-foreground">Ayat tersisa</p>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">{lastRead.surahNomor}/114</p>
              <p className="text-[10px] text-muted-foreground">Surah</p>
            </div>
          </div>
        </div>
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

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <BookmarkCheck className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Ayat Ditandai</h2>
          </div>
          <div className="space-y-2">
            {bookmarks.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/quran/${b.surahNomor}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border transition-all active:scale-[0.98] hover:shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-accent">{b.nomorAyat}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{b.surahNamaLatin}</p>
                  <p className="text-xs text-muted-foreground">Ayat {b.nomorAyat}</p>
                </div>
                <p className="font-arabic text-base text-primary flex-shrink-0">{b.surahNama}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
