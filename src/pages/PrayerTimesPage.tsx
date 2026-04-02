import { useEffect, useState } from 'react';
import { MapPin, Loader2, Bell, BellOff } from 'lucide-react';
import { fetchPrayerTimes } from '@/lib/api';
import { requestNotificationPermission, schedulePrayerNotifications, cancelPrayerNotifications, isNotificationEnabled } from '@/lib/notifications';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
}

const PrayerTimesPage = () => {
  const [times, setTimes] = useState<PrayerTime[]>([]);
  const [hijri, setHijri] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        let lat = -6.2088;
        let lng = 106.8456;

        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
        } catch {
          setLocationName('Jakarta (default)');
        }

        const data = await fetchPrayerTimes(lat, lng);
        const t = data.timings;
        setTimes([
          { name: 'Subuh', nameAr: 'الفجر', time: t.Fajr },
          { name: 'Syuruq', nameAr: 'الشروق', time: t.Sunrise },
          { name: 'Dzuhur', nameAr: 'الظهر', time: t.Dhuhr },
          { name: 'Ashar', nameAr: 'العصر', time: t.Asr },
          { name: 'Maghrib', nameAr: 'المغرب', time: t.Maghrib },
          { name: 'Isya', nameAr: 'العشاء', time: t.Isha },
        ]);
        const h = data.date.hijri;
        setHijri(`${h.day} ${h.month.ar} ${h.year}`);

        // Restore notification state
        setNotificationsEnabled(isNotificationEnabled());
      } catch (e) {
        setError('Gagal memuat jadwal shalat');
      }
      setLoading(false);
    };
    load();
  }, []);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const getNextPrayer = () => {
    for (const t of times) {
      const [h, m] = t.time.split(':').map(Number);
      if (h * 60 + m > currentMinutes) return t.name;
    }
    return times[0]?.name;
  };

  const nextPrayer = getNextPrayer();

  const handleToggleNotifications = async () => {
    setNotifLoading(true);
    try {
      if (notificationsEnabled) {
        await cancelPrayerNotifications();
        setNotificationsEnabled(false);
        toast('Notifikasi dimatikan', { duration: 2000 });
      } else {
        const granted = await requestNotificationPermission();
        if (!granted) {
          toast('Izin notifikasi ditolak. Aktifkan di pengaturan browser/HP.', { duration: 3000 });
          setNotifLoading(false);
          return;
        }
        const prayerTimes = times.filter(t => t.name !== 'Syuruq');
        await schedulePrayerNotifications(prayerTimes);
        setNotificationsEnabled(true);
        toast('Notifikasi shalat diaktifkan!', { duration: 2000 });
      }
    } catch (e) {
      toast('Gagal mengatur notifikasi', { duration: 2000 });
    }
    setNotifLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-foreground">Jadwal Shalat</h1>
        <button
          onClick={handleToggleNotifications}
          disabled={notifLoading}
          className={`p-2 rounded-lg transition-all active:scale-90 ${
            notificationsEnabled
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center gap-1.5 mb-6">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{locationName}</p>
        {hijri && <span className="text-xs text-muted-foreground">• {hijri}</span>}
        {notificationsEnabled && (
          <span className="text-xs text-primary font-medium ml-1">• Notifikasi aktif</span>
        )}
      </div>

      <div className="space-y-2.5">
        {times.map((t) => {
          const isNext = t.name === nextPrayer;
          return (
            <div
              key={t.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all animate-fade-in ${
                isNext
                  ? 'bg-primary/10 border-primary/30 shadow-sm'
                  : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isNext ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
                <div>
                  <p className={`text-sm font-semibold ${isNext ? 'text-primary' : 'text-foreground'}`}>{t.name}</p>
                  <p className="text-xs text-muted-foreground font-arabic">{t.nameAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notificationsEnabled && t.name !== 'Syuruq' && (
                  <Bell className="w-3 h-3 text-primary/50" />
                )}
                <p className={`text-lg font-bold tabular-nums ${isNext ? 'text-primary' : 'text-foreground'}`}>
                  {t.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PrayerTimesPage;
