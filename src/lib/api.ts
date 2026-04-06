import { db, type Surah, type Verse, type Translation } from './db';
import { JUZ_DATA, type JuzRange } from './juzData';

const API_BASE = 'https://equran.id/api/v2';
const GLOBAL_QURAN_API = 'https://api.globalquran.com';

const TRANSLATIONS = [
  { id: 'en.sahih', name: 'Saheeh International', language: 'English' },
  { id: 'id.indonesian', name: 'Indonesian', language: 'Indonesian' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', language: 'Arabic' },
  { id: 'ur.jalandhry', name: 'Fateh Muhammad Jalandhry', language: 'Urdu' },
  { id: 'fr.hamidullah', name: 'Muhammad Hamidullah', language: 'French' },
];

interface PrayerTimesResponse {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  date: {
    hijri: {
      day: string;
      month: { ar: string };
      year: string;
    };
  };
}

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

export async function fetchAndSyncTranslations(
  surahNumber: number,
  translationId: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const existing = await db.translations
    .where('[surahNomor+translationId]')
    .equals([surahNumber, translationId])
    .count();
  if (existing > 0) return;

  const res = await fetch(`${GLOBAL_QURAN_API}/quran/${translationId}/${surahNumber}`);
  const data = await res.json();

  const translations: Translation[] = data.quran.map((verse: any, index: number) => ({
    surahNomor: surahNumber,
    nomorAyat: index + 1,
    translationId,
    text: verse.verse,
    language: TRANSLATIONS.find(t => t.id === translationId)?.language || 'Unknown',
  }));

  await db.translations.bulkAdd(translations);
  onProgress?.(surahNumber, 114);
}

export async function getTranslations(surahNumber: number, translationId: string): Promise<Translation[]> {
  let translations = await db.translations
    .where('[surahNomor+translationId]')
    .equals([surahNumber, translationId])
    .toArray();
  if (translations.length === 0) {
    await fetchAndSyncTranslations(surahNumber, translationId);
    translations = await db.translations
      .where('[surahNomor+translationId]')
      .equals([surahNumber, translationId])
      .toArray();
  }
  return translations.sort((a, b) => a.nomorAyat - b.nomorAyat);
}

export async function getAvailableTranslations(): Promise<typeof TRANSLATIONS> {
  return TRANSLATIONS;
}

export async function getJuzVerses(juzNumber: number): Promise<{ verses: Verse[]; surahs: Surah[] }> {
  const juz = JUZ_DATA.find(j => j.juz === juzNumber);
  if (!juz) return { verses: [], surahs: [] };

  const surahNumbers: number[] = [];
  for (let i = juz.startSurah; i <= juz.endSurah; i++) {
    surahNumbers.push(i);
  }

  // Fetch all surah data
  const allSurahs = await db.surahs.bulkGet(surahNumbers);
  const surahs = allSurahs.filter((s): s is Surah => !!s);

  // Fetch verses for each surah in range
  const allVerses: Verse[] = [];
  for (const surahNum of surahNumbers) {
    let verses = await db.verses.where('surahNomor').equals(surahNum).toArray();
    if (verses.length === 0) {
      verses = await fetchAndSyncVerses(surahNum);
    }

    // Filter verses within juz range
    if (surahNum === juz.startSurah && surahNum === juz.endSurah) {
      // Same surah start and end
      verses = verses.filter(v => v.nomorAyat >= juz.startAyat && v.nomorAyat <= juz.endAyat);
    } else if (surahNum === juz.startSurah) {
      verses = verses.filter(v => v.nomorAyat >= juz.startAyat);
    } else if (surahNum === juz.endSurah) {
      verses = verses.filter(v => v.nomorAyat <= juz.endAyat);
    }

    allVerses.push(...verses.sort((a, b) => a.nomorAyat - b.nomorAyat));
  }

  return { verses: allVerses, surahs };
}

export async function searchVerses(query: string): Promise<Verse[]> {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  const allVerses = await db.verses.toArray();
  return allVerses.filter(
    (v) =>
      v.teksIndonesia.toLowerCase().includes(q) ||
      v.teksLatin.toLowerCase().includes(q) ||
      v.teksArab.includes(query.trim())
  );
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

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || 'Unknown';
    return city;
  } catch {
    return 'Unknown';
  }
}
