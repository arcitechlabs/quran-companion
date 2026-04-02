import { db, type Surah, type Verse } from './db';

const API_BASE = 'https://equran.id/api/v2';

export async function fetchAndSyncSurahs(onProgress?: (p: number) => void): Promise<void> {
  const existing = await db.surahs.count();
  if (existing >= 114) return;

  const res = await fetch(`${API_BASE}/surat`);
  const data = await res.json();
  const surahs: Surah[] = data.data.map((s: any) => ({
    nomor: s.nomor,
    nama: s.nama,
    namaLatin: s.namaLatin,
    jumlahAyat: s.jumlahAyat,
    tempatTurun: s.tempatTurun,
    arti: s.arti,
    deskripsi: s.deskripsi,
    audioFull: s.audioFull?.['05'] || '',
  }));

  await db.surahs.bulkPut(surahs);
  onProgress?.(5);
}

export async function fetchAndSyncVerses(
  surahNumber: number,
  onProgress?: (current: number, total: number) => void
): Promise<Verse[]> {
  const existing = await db.verses.where('surahNomor').equals(surahNumber).toArray();
  if (existing.length > 0) return existing;

  const res = await fetch(`${API_BASE}/surat/${surahNumber}`);
  const data = await res.json();
  const verses: Verse[] = data.data.ayat.map((a: any) => ({
    surahNomor: surahNumber,
    nomorAyat: a.nomorAyat,
    teksArab: a.teksArab,
    teksLatin: a.teksLatin,
    teksIndonesia: a.teksIndonesia,
    audio: a.audio?.['05'] || '',
  }));

  await db.verses.bulkAdd(verses);
  onProgress?.(surahNumber, 114);
  return verses;
}

export async function syncAllData(onProgress?: (p: number) => void): Promise<void> {
  await fetchAndSyncSurahs(onProgress);

  for (let i = 1; i <= 114; i++) {
    await fetchAndSyncVerses(i);
    onProgress?.(Math.round((i / 114) * 100));
  }

  await db.syncMeta.put({
    key: 'lastSync',
    value: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getSurahs(): Promise<Surah[]> {
  return db.surahs.orderBy('nomor').toArray();
}

export async function getVerses(surahNumber: number): Promise<Verse[]> {
  let verses = await db.verses.where('surahNomor').equals(surahNumber).toArray();
  if (verses.length === 0) {
    verses = await fetchAndSyncVerses(surahNumber);
  }
  return verses.sort((a, b) => a.nomorAyat - b.nomorAyat);
}

export async function isSynced(): Promise<boolean> {
  const meta = await db.syncMeta.get('lastSync');
  return !!meta;
}

interface PrayerTimesResponse {
  timings: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    Sunrise: string;
  };
  date: {
    hijri: {
      day: string;
      month: { en: string; ar: string };
      year: string;
    };
  };
}

export async function fetchPrayerTimes(lat: number, lng: number): Promise<PrayerTimesResponse> {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=20`
  );
  const data = await res.json();
  return data.data;
}
