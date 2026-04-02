import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Bell, BellOff, CalendarDays, Moon, Check, RotateCcw, Loader2 } from 'lucide-react';
import { fetchPrayerTimes } from '@/lib/api';
import { requestNotificationPermission } from '@/lib/notifications';
import { toast } from 'sonner';

interface FastingDay {
  date: string; // YYYY-MM-DD
  type: 'sunnah' | 'qadha' | 'nazr' | 'custom';
  completed: boolean;
  note?: string;
}

const SUNNAH_FASTS = [
  { name: 'Senin', desc: 'Puasa sunnah hari Senin', days: [1] },
  { name: 'Kamis', desc: 'Puasa sunnah hari Kamis', days: [4] },
  { name: 'Ayyamul Bidh', desc: 'Tanggal 13, 14, 15 setiap bulan Hijriyah', days: [13, 14, 15] },
  { name: 'Asyura (10 Muharram)', desc: 'Puasa Asyura', month: 1, day: 10 },
  { name: 'Tasu\'a (9 Muharram)', desc: 'Puasa Tasu\'a', month: 1, day: 9 },
  { name: 'Arafah (9 Dzulhijjah)', desc: 'Puasa Arafah', month: 12, day: 9 },
  { name: 'Ramadhan', desc: 'Puasa Ramadhan', month: 9 },
  { name: '6 hari Syawal', desc: 'Puasa 6 hari di bulan Syawal', month: 10 },
];

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getNextNDays(n: number): { date: string; dayName: string; hijri: string }[] {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = addDays(today, i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('id-ID', { weekday: 'long' }),
      hijri: '',
    });
  }
  return days;
}

const FastingPage = () => {
  const navigate = useNavigate();
  const [fastingDays, setFastingDays] = useState<FastingDay[]>(() => {
    const saved = localStorage.getItem('fastingDays');
    return saved ? JSON.parse(saved) : [];
  });
  const [sahurTime, setSahurTime] = useState('');
  const [sahurAlarmEnabled, setSahurAlarmEnabled] = useState(() => {
    return localStorage.getItem('sahurAlarmEnabled') === 'true';
  });
  const [loadingAlarm, setLoadingAlarm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<FastingDay['type']>('sunnah');
  const [customNote, setCustomNote] = useState('');

  const upcomingDays = getNextNDays(14);

  useEffect(() => {
    localStorage.setItem('fastingDays', JSON.stringify(fastingDays));
  }, [fastingDays]);

  // Load Subuh time for sahur alarm
  useEffect(() => {
    const loadPrayerTime = async () => {
      try {
        let lat = -6.2088;
        let lng = 106.8456;
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch { /* use default */ }

        const data = await fetchPrayerTimes(lat, lng);
        const fajr = data.timings.Fajr;
        setSahurTime(fajr);
      } catch { /* ignore */ }
    };
    loadPrayerTime();
  }, []);

  const toggleFastingDay = useCallback((date: string, type: FastingDay['type'], note?: string) => {
    setFastingDays(prev => {
      const existing = prev.find(f => f.date === date);
      if (existing) {
        return prev.filter(f => f.date !== date);
      }
      return [...prev, { date, type, completed: false, note }];
    });
  }, []);

  const markCompleted = useCallback((date: string) => {
    setFastingDays(prev => prev.map(f =>
      f.date === date ? { ...f, completed: !f.completed } : f
    ));
  }, []);

  const isFasting = (date: string) => fastingDays.some(f => f.date === date);
  const getFastingInfo = (date: string) => fastingDays.find(f => f.date === date);

  const handleSahurAlarm = async () => {
    setLoadingAlarm(true);
    if (sahurAlarmEnabled) {
      setSahurAlarmEnabled(false);
      localStorage.setItem('sahurAlarmEnabled', 'false');
      toast('Alarm sahur dimatikan', { duration: 2000 });
    } else {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast('Izin notifikasi ditolak', { duration: 2000 });
        setLoadingAlarm(false);
        return;
      }
      setSahurAlarmEnabled(true);
      localStorage.setItem('sahurAlarmEnabled', 'true');

      // Schedule sahur alarm (30 mins before Fajr)
      if (sahurTime) {
        const [h, m] = sahurTime.split(':').map(Number);
        const alarmDate = new Date();
        alarmDate.setHours(h, m - 30, 0, 0);
        if (alarmDate <= new Date()) {
          alarmDate.setDate(alarmDate.getDate() + 1);
        }
        const delay = alarmDate.getTime() - Date.now();
        if (delay > 0 && delay < 86400000) {
          setTimeout(() => {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('⏰ Waktu Sahur!', {
                body: `Subuh pukul ${sahurTime}. Segera sahur!`,
                icon: '/favicon.ico',
                tag: 'sahur-alarm',
              });
            }
          }, delay);
        }
      }
      toast('Alarm sahur diaktifkan (30 menit sebelum Subuh)', { duration: 3000 });
    }
    setLoadingAlarm(false);
  };

  const typeLabels: Record<FastingDay['type'], { label: string; color: string }> = {
    sunnah: { label: 'Sunnah', color: 'bg-primary/10 text-primary' },
    qadha: { label: 'Qadha', color: 'bg-accent/10 text-accent' },
    nazr: { label: 'Nazar', color: 'bg-destructive/10 text-destructive' },
    custom: { label: 'Lainnya', color: 'bg-muted text-muted-foreground' },
  };

  const totalCompleted = fastingDays.filter(f => f.completed).length;
  const totalPlanned = fastingDays.length;

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Jadwal Shaum</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-primary text-primary-foreground transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Sahur Alarm */}
      <div className="mb-4 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${sahurAlarmEnabled ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
              {sahurAlarmEnabled ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Alarm Sahur</p>
              <p className="text-xs text-muted-foreground">
                {sahurTime ? `30 menit sebelum Subuh (${sahurTime})` : 'Memuat jadwal...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSahurAlarm}
            disabled={loadingAlarm || !sahurTime}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              sahurAlarmEnabled ? 'bg-destructive/10 text-destructive' : 'bg-primary text-primary-foreground'
            }`}
          >
            {loadingAlarm ? <Loader2 className="w-4 h-4 animate-spin" /> : sahurAlarmEnabled ? 'Matikan' : 'Aktifkan'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-primary">{totalPlanned}</p>
          <p className="text-xs text-muted-foreground">Terencana</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-2xl font-bold text-accent">{totalCompleted}</p>
          <p className="text-xs text-muted-foreground">Selesai</p>
        </div>
      </div>

      {/* Quick add sunnah */}
      {showAddForm && (
        <div className="mb-4 p-4 rounded-xl bg-card border border-border animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-3">Tambah Puasa Cepat</h3>
          <div className="flex gap-2 mb-3">
            {(['sunnah', 'qadha', 'nazr', 'custom'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedType === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {typeLabels[t].label}
              </button>
            ))}
          </div>

          <div className="space-y-2 mb-3">
            {SUNNAH_FASTS.map((sf, i) => (
              <button
                key={i}
                onClick={() => {
                  const today = new Date();
                  if (sf.month && sf.day) {
                    // Specific Hijri date — approximate next occurrence
                    const nextDate = addDays(today, 0);
                    toggleFastingDay(nextDate.toISOString().split('T')[0], selectedType, sf.name);
                    toast(`${sf.name} ditambahkan`, { duration: 1500 });
                  } else if (sf.days) {
                    // Day of week
                    for (let offset = 0; offset < 28; offset++) {
                      const d = addDays(today, offset);
                      if (sf.days.includes(d.getDay())) {
                        toggleFastingDay(d.toISOString().split('T')[0], selectedType, sf.name);
                      }
                    }
                    toast(`${sf.name} ditambahkan (4 minggu)`, { duration: 1500 });
                  } else if (sf.month) {
                    // Entire month — add first 5 days as sample
                    for (let offset = 0; offset < 5; offset++) {
                      const d = addDays(today, offset);
                      toggleFastingDay(d.toISOString().split('T')[0], selectedType, sf.name);
                    }
                    toast(`${sf.name} ditambahkan`, { duration: 1500 });
                  }
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border text-left transition-all active:scale-[0.98]"
              >
                <Moon className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">{sf.name}</p>
                  <p className="text-[10px] text-muted-foreground">{sf.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 14-day calendar */}
      <h2 className="text-sm font-semibold text-foreground mb-3">14 Hari ke Depan</h2>
      <div className="space-y-2">
        {upcomingDays.map(day => {
          const fasting = getFastingInfo(day.date);
          const isToday = day.date === getTodayStr();
          const typeInfo = fasting ? typeLabels[fasting.type] : null;

          return (
            <div
              key={day.date}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                fasting
                  ? fasting.completed
                    ? 'bg-accent/5 border-accent/30'
                    : 'bg-primary/5 border-primary/20'
                  : isToday
                  ? 'bg-card border-border'
                  : 'bg-card border-border'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${
                isToday ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <span className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {new Date(day.date + 'T00:00:00').getDate()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {day.dayName.slice(0, 3)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {day.dayName}, {new Date(day.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  {isToday && <span className="text-xs text-primary ml-2">Hari ini</span>}
                </p>
                {fasting && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeInfo?.color}`}>{typeInfo?.label}</span>
                    {fasting.note && <span className="text-[10px] text-muted-foreground">{fasting.note}</span>}
                    {fasting.completed && <Check className="w-3 h-3 text-accent" />}
                  </div>
                )}
              </div>

              <div className="flex gap-1.5">
                {fasting && (
                  <button
                    onClick={() => markCompleted(day.date)}
                    className={`p-2 rounded-lg transition-all active:scale-90 ${
                      fasting.completed ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {fasting.completed ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (fasting) {
                      toggleFastingDay(day.date, fasting.type);
                    } else {
                      toggleFastingDay(day.date, selectedType);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all active:scale-90 ${
                    fasting ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {fasting ? <span className="text-xs">✕</span> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FastingPage;
