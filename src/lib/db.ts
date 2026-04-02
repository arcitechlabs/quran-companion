import Dexie, { type Table } from 'dexie';

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull?: string;
}

export interface Verse {
  id?: number;
  surahNomor: number;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: string;
}

export interface KhatamPlan {
  id?: number;
  name: string;
  totalDays: number;
  startDate: string;
  currentDay: number;
  completedVerses: number;
  totalVerses: number;
  isActive: boolean;
  dailyTarget: number;
  lastReadSurah: number;
  lastReadAyat: number;
}

export interface DzikirCount {
  id?: number;
  name: string;
  target: number;
  count: number;
  date: string;
}

export interface Bookmark {
  id?: number;
  surahNomor: number;
  surahNama: string;
  surahNamaLatin: string;
  nomorAyat: number;
  createdAt: string;
  isLastRead?: boolean;
}

export interface SyncMeta {
  key: string;
  value: string;
  updatedAt: string;
}

class QuranDatabase extends Dexie {
  surahs!: Table<Surah, number>;
  verses!: Table<Verse, number>;
  khatamPlans!: Table<KhatamPlan, number>;
  dzikirCounts!: Table<DzikirCount, number>;
  syncMeta!: Table<SyncMeta, string>;

  constructor() {
    super('QuranAppDB');
    this.version(1).stores({
      surahs: 'nomor, namaLatin',
      verses: '++id, surahNomor, [surahNomor+nomorAyat]',
      khatamPlans: '++id, isActive',
      dzikirCounts: '++id, date',
      syncMeta: 'key',
    });
  }
}

export const db = new QuranDatabase();
