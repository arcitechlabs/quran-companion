import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

interface PrayerNotification {
  id: number;
  name: string;
  time: string; // HH:MM
}

const PRAYER_NOTIFICATIONS: Record<string, number> = {
  'Subuh': 101,
  'Dzuhur': 102,
  'Ashar': 103,
  'Maghrib': 104,
  'Isya': 105,
};

const NOTIFICATION_HOUR_OFFSET = 0; // notify exactly at prayer time
const NOTIFICATION_MINUTE_OFFSET = 0;

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
  const prayers = times.filter(t => t.name in PRAYER_NOTIFICATIONS);

  if (Capacitor.isNativePlatform()) {
    // Cancel existing notifications first
    const existingIds = Object.values(PRAYER_NOTIFICATIONS).map(id => ({ id }));
    try {
      await LocalNotifications.cancel({ notifications: existingIds });
    } catch {
      // ignore if none exist
    }

    const today = new Date();

    for (const prayer of prayers) {
      const [h, m] = prayer.time.split(':').map(Number);
      const scheduleDate = new Date(today);
      scheduleDate.setHours(h, m, 0, 0);

      // If time already passed today, schedule for tomorrow
      if (scheduleDate <= today) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      const options: ScheduleOptions = {
        notifications: [
          {
            id: PRAYER_NOTIFICATIONS[prayer.name],
            title: `Waktu ${prayer.name}`,
            body: `Sudah masuk waktu shalat ${prayer.name}. Yuk segera shalat!`,
            schedule: {
              at: scheduleDate,
              allowWhileIdle: true,
              repeats: true,
              every: 'day',
            },
            extra: { prayer: prayer.name },
          },
        ],
      };

      await LocalNotifications.schedule(options);
    }
  } else {
    // Web: Store schedule in localStorage for service worker / manual check
    const schedule = prayers.map(p => ({
      id: PRAYER_NOTIFICATIONS[p.name],
      name: p.name,
      time: p.time,
    }));
    localStorage.setItem('prayerNotifications', JSON.stringify(schedule));
    localStorage.setItem('prayerNotificationsEnabled', 'true');

    // Schedule web notifications using setTimeout for today's remaining prayers
    scheduleWebNotifications(prayers);
  }
}

let webNotificationTimers: ReturnType<typeof setTimeout>[] = [];

function scheduleWebNotifications(prayers: { name: string; time: string }[]): void {
  // Clear existing timers
  webNotificationTimers.forEach(t => clearTimeout(t));
  webNotificationTimers = [];

  const now = new Date();

  for (const prayer of prayers) {
    const [h, m] = prayer.time.split(':').map(Number);
    const scheduleDate = new Date(now);
    scheduleDate.setHours(h, m, 0, 0);

    if (scheduleDate <= now) continue; // Skip past times

    const delay = scheduleDate.getTime() - now.getTime();

    const timer = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Waktu ${prayer.name}`, {
          body: `Sudah masuk waktu shalat ${prayer.name}. Yuk segera shalat!`,
          icon: '/favicon.ico',
          tag: `prayer-${prayer.name}`,
        });
      }
    }, delay);

    webNotificationTimers.push(timer);
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

export function isNotificationEnabled(): boolean {
  return localStorage.getItem('prayerNotificationsEnabled') === 'true';
}
