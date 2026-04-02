import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export type NotificationSound = 'adzan' | 'beep' | 'silent';

export interface PrayerNotificationSetting {
  enabled: boolean;
  sound: NotificationSound;
}

export interface PrayerNotificationSettings {
  [prayerName: string]: PrayerNotificationSetting;
}

const PRAYER_NOTIFICATIONS: Record<string, number> = {
  'Subuh': 101,
  'Dzuhur': 102,
  'Ashar': 103,
  'Maghrib': 104,
  'Isya': 105,
};

const DEFAULT_SETTINGS: PrayerNotificationSettings = {
  'Subuh': { enabled: true, sound: 'adzan' },
  'Dzuhur': { enabled: true, sound: 'adzan' },
  'Ashar': { enabled: true, sound: 'adzan' },
  'Maghrib': { enabled: true, sound: 'adzan' },
  'Isya': { enabled: true, sound: 'adzan' },
};

function getSettingsKey(): string {
  return 'prayerNotificationSettings';
}

export function getNotificationSettings(): PrayerNotificationSettings {
  const saved = localStorage.getItem(getSettingsKey());
  if (saved) {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  return DEFAULT_SETTINGS;
}

export function saveNotificationSettings(settings: PrayerNotificationSettings): void {
  localStorage.setItem(getSettingsKey(), JSON.stringify(settings));
}

export function isNotificationEnabled(): boolean {
  return localStorage.getItem('prayerNotificationsEnabled') === 'true';
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display === 'granted') return true;
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  if ('Notification' in window) {
    if (Notification.permission === 'granted') return true;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  return false;
}

export async function schedulePrayerNotifications(
  times: { name: string; time: string }[]
): Promise<void> {
  const settings = getNotificationSettings();
  const prayers = times.filter(t => t.name in PRAYER_NOTIFICATIONS);

  if (Capacitor.isNativePlatform()) {
    const existingIds = Object.values(PRAYER_NOTIFICATIONS).map(id => ({ id }));
    try {
      await LocalNotifications.cancel({ notifications: existingIds });
    } catch {
      // ignore
    }

    const today = new Date();

    for (const prayer of prayers) {
      const setting = settings[prayer.name];
      if (!setting || !setting.enabled) continue;

      const [h, m] = prayer.time.split(':').map(Number);
      const scheduleDate = new Date(today);
      scheduleDate.setHours(h, m, 0, 0);

      if (scheduleDate <= today) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      const options: ScheduleOptions = {
        notifications: [
          {
            id: PRAYER_NOTIFICATIONS[prayer.name],
            title: `Waktu ${prayer.name}`,
            body: `Sudah masuk waktu shalat ${prayer.name}. Yuk segera珈!`,
            smallIcon: 'ic_launcher',
            largeIcon: 'ic_launcher',
            sound: setting.sound === 'silent' ? undefined : 'default',
            schedule: {
              at: scheduleDate,
              allowWhileIdle: true,
              repeats: true,
              every: 'day',
            },
            extra: { prayer: prayer.name, sound: setting.sound },
          },
        ],
      };

      await LocalNotifications.schedule(options);
    }
  } else {
    const enabledPrayers = prayers.filter(p => settings[p.name]?.enabled);
    const schedule = enabledPrayers.map(p => ({
      id: PRAYER_NOTIFICATIONS[p.name],
      name: p.name,
      time: p.time,
      sound: settings[p.name]?.sound || 'adzan',
    }));
    localStorage.setItem('prayerNotifications', JSON.stringify(schedule));
    localStorage.setItem('prayerNotificationsEnabled', 'true');

    scheduleWebNotifications(enabledPrayers, settings);
  }
}

let webNotificationTimers: ReturnType<typeof setTimeout>[] = [];

function scheduleWebNotifications(
  prayers: { name: string; time: string }[],
  settings: PrayerNotificationSettings
): void {
  webNotificationTimers.forEach(t => clearTimeout(t));
  webNotificationTimers = [];

  const now = new Date();

  for (const prayer of prayers) {
    const setting = settings[prayer.name];
    if (!setting || !setting.enabled) continue;

    const [h, m] = prayer.time.split(':').map(Number);
    const scheduleDate = new Date(now);
    scheduleDate.setHours(h, m, 0, 0);

    if (scheduleDate <= now) continue;

    const delay = scheduleDate.getTime() - now.getTime();

    const timer = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notif = new Notification(`Waktu ${prayer.name}`, {
          body: `Sudah masuk waktu shalat ${prayer.name}. Yuk segera珈!`,
          icon: '/favicon.ico',
          tag: `prayer-${prayer.name}`,
        });

        if (setting.sound === 'beep') {
          playBeepSound();
        } else if (setting.sound === 'adzan') {
          playAdzanSound();
        }
      }
    }, delay);

    webNotificationTimers.push(timer);
  }
}

export function playAdzanSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  } catch (e) {
    console.log('Audio not supported');
  }
}

export function playBeepSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);

    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 800;
      osc2.type = 'square';
      gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.3);
    }, 400);
  } catch (e) {
    console.log('Audio not supported');
  }
}

export async function cancelPrayerNotifications(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const existingIds = Object.values(PRAYER_NOTIFICATIONS).map(id => ({ id }));
    try {
      await LocalNotifications.cancel({ notifications: existingIds });
    } catch {
      // ignore
    }
  } else {
    webNotificationTimers.forEach(t => clearTimeout(t));
    webNotificationTimers = [];
    localStorage.setItem('prayerNotificationsEnabled', 'false');
    localStorage.removeItem('prayerNotifications');
  }
}

export async function testNotificationSound(sound: NotificationSound): Promise<void> {
  if (sound === 'silent') {
    if ('Notification' in window) {
      new Notification('Test Notifikasi', {
        body: 'Notifikasi无声 (tanpa suara)',
        icon: '/favicon.ico',
      });
    }
  } else if (sound === 'beep') {
    playBeepSound();
    if ('Notification' in window) {
      new Notification('Test Beep', {
        body: 'Test bunyi beep',
        icon: '/favicon.ico',
      });
    }
  } else if (sound === 'adzan') {
    playAdzanSound();
    if ('Notification' in window) {
      new Notification('Test Adzan', {
        body: 'Test bunyi adzan',
        icon: '/favicon.ico',
      });
    }
  }
}
