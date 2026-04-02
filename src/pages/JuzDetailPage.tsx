import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { getJuzVerses } from '@/lib/api';
import { db } from '@/lib/db';
import type { Surah, Verse } from '@/lib/db';
import { JUZ_DATA } from '@/lib/juzData';
import { toast } from 'sonner';
import { useAudioStore } from '@/stores/audioStore';

const toArabicNumeral = (n: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(d => arabicDigits[parseInt(d)]).join('');
};

const JuzDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const juzNumber = Number(id);
  const juzInfo = JUZ_DATA.find(j => j.juz === juzNumber);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surahMap, setSurahMap] = useState<Record<number, Surah>>({});
  const [loading, setLoading] = useState(true);
  const [bookmarkedAyats, setBookmarkedAyats] = useState<Set<string>>(new Set());

  const { isPlaying, currentSurah, currentAyat, play, pause, setAutoPlayNext } = useAudioStore();

  useEffect(() => {
    const load = async () => {
      if (!juzInfo) { setLoading(false); return; }

      const data = await getJuzVerses(juzNumber);
      setVerses(data.verses);
      setSurahs(data.surahs);

      const map: Record<number, Surah> = {};
      data.surahs.forEach(s => { map[s.nomor] = s; });
      setSurahMap(map);

      // Load bookmarks
      const bmarks = await db.bookmarks
        .filter(b => !b.isLastRead && b.surahNomor >= juzInfo.startSurah && b.surahNomor <= juzInfo.endSurah)
        .toArray();
      const markSet = new Set(bmarks.map(b => `${b.surahNomor}:${b.nomorAyat}`));
      setBookmarkedAyats(markSet);

      setLoading(false);
    };
    load();
  }, [juzNumber, juzInfo]);

  const handlePlayAyat = useCallback((surahNomor: number, ayat: number) => {
    const verse = verses.find(v => v.surahNomor === surahNomor && v.nomorAyat === ayat);
    if (!verse?.audio) return;

    if (currentSurah === surahNomor && currentAyat === ayat && isPlaying) {
      pause();
    } else {
      play(surahNomor, ayat, verse.audio);
    }
  }, [verses, currentSurah, currentAyat, isPlaying, play, pause]);

  useEffect(() => {
    setAutoPlayNext(() => {
      if (!currentSurah || !currentAyat) return;
      const idx = verses.findIndex(v => v.surahNomor === currentSurah && v.nomorAyat === currentAyat);
      if (idx >= 0 && idx < verses.length - 1) {
        const next = verses[idx + 1];
        play(next.surahNomor, next.nomorAyat, next.audio || '');
      }
    });
  }, [currentSurah, currentAyat, verses, play, setAutoPlayNext]);

  const handleBookmark = async (surah: Surah, ayat: number) => {
    const key = `${surah.nomor}:${ayat}`;
    const existing = await db.bookmarks
      .where('[surahNomor+nomorAyat]')
      .equals([surah.nomor, ayat])
      .filter(b => !b.isLastRead)
      .first();

    if (existing) {
      await db.bookmarks.delete(existing.id!);
      setBookmarkedAyats(prev => { const n = new Set(prev); n.delete(key); return n; });
      toast('Bookmark dihapus', { duration: 1200 });
    } else {
      await db.bookmarks.add({
        surahNomor: surah.nomor,
        surahNama: surah.nama,
        surahNamaLatin: surah.namaLatin,
        nomorAyat: ayat,
        createdAt: new Date().toISOString(),
        isLastRead: false,
      });
      setBookmarkedAyats(prev => { const n = new Set(prev); n.add(key); return n; });
      toast('Ayat ditandai', { duration: 1200 });
    }
  };

  // Group verses by surah
  const grouped: { surah: Surah; verses: Verse[] }[] = [];
  for (const s of surahs) {
    const sv = verses.filter(v => v.surahNomor === s.nomor);
    if (sv.length > 0) {
      grouped.push({ surah: s, verses: sv });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-6 px-4">
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!juzInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Juz tidak ditemukan</p>
      </div>
    );
  }

  const totalVerses = verses.length;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/quran')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground">Juz {juzNumber}</h1>
            <p className="text-xs text-muted-foreground">
              {surahMap[juzInfo.startSurah]?.namaLatin} ayat {juzInfo.startAyat}
              {juzInfo.startSurah !== juzInfo.endSurah && ` — ${surahMap[juzInfo.endSurah]?.namaLatin} ayat ${juzInfo.endAyat}`}
              {' • '}{totalVerses} ayat
            </p>
          </div>
          <p className="font-arabic text-lg text-primary">الجزء {toArabicNumeral(juzNumber)}</p>
        </div>
      </div>

      {/* Verses grouped by surah */}
      <div className="px-4 py-4 space-y-6">
        {grouped.map(({ surah, verses: surahVerses }) => (
          <div key={surah.nomor}>
            {/* Surah header */}
            <button
              onClick={() => navigate(`/quran/${surah.nomor}`)}
              className="w-full mb-3 p-3 rounded-xl bg-primary/5 border border-primary/15 text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{surah.nomor}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{surah.namaLatin}</p>
                  <p className="text-xs text-muted-foreground">{surah.tempatTurun} • {surah.arti}</p>
                </div>
                <p className="font-arabic text-lg text-primary">{surah.nama}</p>
              </div>
            </button>

            {/* Bismillah (except for Al-Fatihah and At-Taubah) */}
            {surah.nomor !== 1 && surah.nomor !== 9 && (
              <div className="text-center py-3 mb-2">
                <p className="font-arabic text-xl text-primary leading-loose">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            )}

            {/* Verses */}
            <div className="space-y-3">
              {surahVerses.map((verse) => {
                const key = `${verse.surahNomor}:${verse.nomorAyat}`;
                const isMarked = bookmarkedAyats.has(key);
                const isPlayingThis = currentSurah === verse.surahNomor && currentAyat === verse.nomorAyat;

                return (
                  <div key={key} className={`p-4 rounded-xl bg-card border animate-fade-in ${isMarked ? 'border-accent shadow-sm' : 'border-border'} ${isPlayingThis ? 'ring-2 ring-primary/40' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{verse.nomorAyat}</span>
                        </div>
                        {verse.audio && (
                          <button
                            onClick={() => handlePlayAyat(verse.surahNomor, verse.nomorAyat)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isPlayingThis ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                            }`}
                          >
                            {isPlayingThis ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                          </button>
                        )}
                      </div>
                      <button onClick={() => handleBookmark(surah, verse.nomorAyat)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        {isMarked ? (
                          <BookmarkCheck className="w-4 h-4 text-accent" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <p className="font-arabic text-right text-xl leading-[2.5] text-foreground mb-4" dir="rtl">
                      {verse.teksArab}
                    </p>
                    <p className="text-sm text-primary/80 italic mb-2">{verse.teksLatin}</p>
                    <p className="text-sm text-muted-foreground">{verse.teksIndonesia}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Juz Navigation */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-border bg-card">
        <button
          onClick={() => { if (juzNumber > 1) navigate(`/juz/${juzNumber - 1}`); }}
          disabled={juzNumber <= 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground">Sebelumnya</p>
            <p className="text-xs font-semibold">{juzNumber > 1 ? `Juz ${juzNumber - 1}` : ''}</p>
          </div>
        </button>
        <span className="text-xs text-muted-foreground font-medium">{juzNumber}/30</span>
        <button
          onClick={() => { if (juzNumber < 30) navigate(`/juz/${juzNumber + 1}`); }}
          disabled={juzNumber >= 30}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">Selanjutnya</p>
            <p className="text-xs font-semibold">{juzNumber < 30 ? `Juz ${juzNumber + 1}` : ''}</p>
          </div>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default JuzDetailPage;
