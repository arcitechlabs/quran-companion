import { useEffect, useState } from 'react';
import { MapPin, Loader2, Bell, BellOff, Settings, Volume2, VolumeX, Play, Check } from 'lucide-react';
import { fetchPrayerTimes } from '@/lib/api';
import { 
  requestNotificationPermission, 
  schedulePrayerNotifications, 
  cancelPrayerNotifications, 
  isNotificationEnabled,
  getNotificationSettings,
  saveNotificationSettings,
  testNotificationSound,
  type NotificationSound,
  type PrayerNotificationSettings
} from '@/lib/notifications';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
}

const SOUND_OPTIONS: { value: NotificationSound; label: string; icon: typeof Volume2 }[] = [
  { value: 'adzan', label: 'Adzan', icon: Volume2 },
  { value: 'beep', label: 'Beep', icon: Play },
  { value: 'silent', label: 'Diam', icon: VolumeX },
];

const NOTIFICATION_PRAYERS = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

const PrayerTimesPage = () => {
  const [times, setTimes] = useState<PrayerTime[]>([]);
  const [hijri, setHijri] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');
  const { notificationsEnabled, setNotificationsEnabled } = useAppStore();
  const [notifLoading, setNotifLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<PrayerNotificationSettings>(getNotificationSettings);

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

        setNotificationsEnabled(isNotificationEnabled());
        setSettings(getNotificationSettings());
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

  const handleToggleMaster = async () => {
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
        const prayerTimes = times.filter(t => NOTIFICATION_PRAYERS.includes(t.name));
        await schedulePrayerNotifications(prayerTimes);
        setNotificationsEnabled(true);
        toast('Notifikasi珈 aktif!', { duration: 2000 });
      }
    } catch (e) {
      toast('Gagal mengatur notifikasi', { duration: 2000 });
    }
    setNotifLoading(false);
  };

  const handleTogglePrayer = async (prayerName: string) => {
    const newSettings = {
      ...settings,
      [prayerName]: {
        ...settings[prayerName],
        enabled: !settings[prayerName]?.enabled
      }
    };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);

    if (notificationsEnabled) {
      const prayerTimes = times.filter(t => NOTIFICATION_PRAYERS.includes(t.name));
      await schedulePrayerNotifications(prayerTimes);
    }
  };

  const handleSoundChange = async (prayerName: string, sound: NotificationSound) => {
    const newSettings = {
      ...settings,
      [prayerName]: {
        ...settings[prayerName],
        sound
      }
    };
    setSettings(newSettings);
    saveNotificationSettings(newSettings);

    if (notificationsEnabled) {
      const prayerTimes = times.filter(t => NOTIFICATION_PRAYERS.includes(t.name));
      await schedulePrayerNotifications(prayerTimes);
    }
  };

  const handleTestSound = (sound: NotificationSound) => {
    testNotificationSound(sound);
    toast(`Test bunyi ${sound}`, { duration: 1500 });
  };

  const enabledCount = Object.values(settings).filter(s => s.enabled).length;

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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all active:scale-90 ${
              showSettings ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Pengaturan notifikasi"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleToggleMaster}
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
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{locationName}</p>
        {hijri && <span className="text-xs text-muted-foreground">• {hijri}</span>}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 rounded-xl bg-card border border-border animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-foreground">Pengaturan Notifikasi</p>
            <span className="text-xs text-muted-foreground">
              {enabledCount}/5 aktif
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {NOTIFICATION_PRAYERS.map(prayer => {
              const prayerTime = times.find(t => t.name === prayer);
              const setting = settings[prayer] || { enabled: true, sound: 'adzan' as NotificationSound };
              
              return (
                <div key={prayer} className="p-3 rounded-lg bg-background border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePrayer(prayer)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          setting.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {setting.enabled && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-sm font-medium text-foreground">{prayer}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{prayerTime?.time}</span>
                  </div>
                  
                  {setting.enabled && (
                    <div className="flex items-center gap-2 pl-7">
                      {SOUND_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleSoundChange(prayer, opt.value)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                            setting.sound === opt.value
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <opt.icon className="w-3 h-3" />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Sounds */}
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Test bunyi notifikasi:</p>
            <div className="flex gap-2">
              {SOUND_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleTestSound(opt.value)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <opt.icon className="w-3 h-3" />
                  Test {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times List */}
      <div className="space-y-2.5">
        {times.map((t) => {
          const isNext = t.name === nextPrayer;
          const isNotificationOn = notificationsEnabled && settings[t.name]?.enabled;
          
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
                {isNotificationOn && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    settings[t.name]?.sound === 'adzan' ? 'bg-primary/10 text-primary' :
                    settings[t.name]?.sound === 'beep' ? 'bg-accent/10 text-accent' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {settings[t.name]?.sound === 'adzan' ? 'Adzan' :
                     settings[t.name]?.sound === 'beep' ? 'Beep' : 'Diam'}
                  </span>
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
