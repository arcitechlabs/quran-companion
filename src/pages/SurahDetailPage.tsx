import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, List, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { getVerses } from '@/lib/api';
import { db } from '@/lib/db';
import type { Surah, Verse, Bookmark as BookmarkType } from '@/lib/db';
import { toast } from 'sonner';

type ViewMode = 'terjemah' | 'mushaf';

const toArabicNumeral = (n: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(d => arabicDigits[parseInt(d)]).join('');
};

const VERSES_PER_PAGE = 8;

async function saveLastRead(surah: Surah, ayat: number) {
  // Remove old lastRead
  const existing = await db.bookmarks.where('isLastRead').equals(1).toArray();
  if (existing.length > 0) {
    await db.bookmarks.bulkDelete(existing.map(b => b.id!));
  }
  await db.bookmarks.add({
    surahNomor: surah.nomor,
    surahNama: surah.nama,
    surahNamaLatin: surah.namaLatin,
    nomorAyat: ayat,
    createdAt: new Date().toISOString(),
    isLastRead: true,
  });
}

async function toggleBookmark(surah: Surah, ayat: number): Promise<boolean> {
  const existing = await db.bookmarks
    .where('[surahNomor+nomorAyat]')
    .equals([surah.nomor, ayat])
    .filter(b => !b.isLastRead)
    .first();
  if (existing) {
    await db.bookmarks.delete(existing.id!);
    return false;
  } else {
    await db.bookmarks.add({
      surahNomor: surah.nomor,
      surahNama: surah.nama,
      surahNamaLatin: surah.namaLatin,
      nomorAyat: ayat,
      createdAt: new Date().toISOString(),
      isLastRead: false,
    });
    return true;
  }
}

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('terjemah');
  const [bookmarkedAyats, setBookmarkedAyats] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      const num = Number(id);
      const s = await db.surahs.get(num);
      setSurah(s || null);
      const v = await getVerses(num);
      setVerses(v);

      // Load bookmarks for this surah
      const bmarks = await db.bookmarks
        .where('surahNomor').equals(num)
        .filter(b => !b.isLastRead)
        .toArray();
      setBookmarkedAyats(new Set(bmarks.map(b => b.nomorAyat)));

      setLoading(false);

      // Save last read (first ayat)
      if (s) saveLastRead(s, 1);
    };
    load();
  }, [id]);

  const handleBookmark = async (ayat: number) => {
    if (!surah) return;
    const added = await toggleBookmark(surah, ayat);
    setBookmarkedAyats(prev => {
      const next = new Set(prev);
      if (added) next.add(ayat);
      else next.delete(ayat);
      return next;
    });
    toast(added ? `Ayat ${ayat} ditandai` : `Bookmark ayat ${ayat} dihapus`, {
      duration: 1500,
    });
    // Also update last read
    saveLastRead(surah, ayat);
  };

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

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/quran')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate">{surah?.namaLatin}</h1>
            <p className="text-xs text-muted-foreground">{surah?.arti} • {surah?.jumlahAyat} Ayat</p>
          </div>

          <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('terjemah')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'terjemah' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Terjemah"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'mushaf' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Mushaf"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>

          <p className="font-arabic text-xl text-primary">{surah?.nama}</p>
        </div>
      </div>

      {viewMode === 'mushaf' ? (
        <MushafView surah={surah} verses={verses} bookmarkedAyats={bookmarkedAyats} onBookmark={handleBookmark} />
      ) : (
        <TerjemahView surah={surah} verses={verses} bookmarkedAyats={bookmarkedAyats} onBookmark={handleBookmark} />
      )}
    </div>
  );
};

interface ViewProps {
  surah: Surah | null;
  verses: Verse[];
  bookmarkedAyats: Set<number>;
  onBookmark: (ayat: number) => void;
}

/* ── Terjemah View ── */
const TerjemahView = ({ surah, verses, bookmarkedAyats, onBookmark }: ViewProps) => (
  <>
    {surah && surah.nomor !== 1 && surah.nomor !== 9 && (
      <div className="text-center py-6 px-4">
        <p className="font-arabic text-2xl text-primary leading-loose">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    )}
    <div className="px-4 space-y-4 py-4">
      {verses.map((verse) => {
        const isMarked = bookmarkedAyats.has(verse.nomorAyat);
        return (
          <div key={verse.nomorAyat} className={`p-4 rounded-xl bg-card border animate-fade-in ${isMarked ? 'border-accent shadow-sm' : 'border-border'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{verse.nomorAyat}</span>
              </div>
              <button onClick={() => onBookmark(verse.nomorAyat)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                {isMarked ? (
                  <BookmarkCheck className="w-4.5 h-4.5 text-accent" />
                ) : (
                  <Bookmark className="w-4.5 h-4.5 text-muted-foreground" />
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
  </>
);

/* ── Mushaf View (Paginated) ── */
const MushafView = ({ surah, verses, bookmarkedAyats, onBookmark }: ViewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(verses.length / VERSES_PER_PAGE);
  const pageRef = useRef<HTMLDivElement>(null);

  const touchStart = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) setCurrentPage(p => Math.max(0, p - 1));
      else setCurrentPage(p => Math.min(totalPages - 1, p + 1));
    }
    touchStart.current = null;
  }, [totalPages]);

  const pageVerses = verses.slice(currentPage * VERSES_PER_PAGE, (currentPage + 1) * VERSES_PER_PAGE);
  const showBismillah = currentPage === 0 && surah && surah.nomor !== 1 && surah.nomor !== 9;
  const showHeader = currentPage === 0;

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Update last read on page turn
  useEffect(() => {
    if (surah && pageVerses.length > 0) {
      saveLastRead(surah, pageVerses[0].nomorAyat);
    }
  }, [currentPage, surah]);

  return (
    <div className="flex flex-col h-[calc(100vh-52px-72px)]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div ref={pageRef} className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mushaf-page max-w-lg mx-auto border border-border rounded-2xl bg-card shadow-sm overflow-hidden">
          <div className="border border-accent/30 m-2 rounded-xl overflow-hidden">
            <div className="border border-accent/15 m-1 rounded-lg">

              {showHeader && (
                <div className="mx-4 mt-4 mb-2">
                  <div className="relative border-2 border-accent/60 rounded-xl py-3 px-5 text-center bg-accent/5">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-card px-3">
                      <span className="font-arabic text-xs text-accent">❁</span>
                    </div>
                    <p className="font-arabic text-2xl text-foreground leading-relaxed">
                      سُورَةُ {surah?.nama?.replace(/[^\u0600-\u06FF\s]/g, '') || surah?.nama}
                    </p>
                    <p className="font-arabic text-xs text-muted-foreground mt-0.5">
                      {surah?.tempatTurun === 'Mekah' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} ۞ {surah?.jumlahAyat && toArabicNumeral(surah.jumlahAyat)} آيَة
                    </p>
                  </div>
                </div>
              )}

              {showBismillah && (
                <div className="text-center py-3">
                  <p className="font-arabic text-[1.5rem] text-foreground leading-loose">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <div className="h-px w-12 bg-accent/30" />
                    <span className="font-arabic text-accent/50 text-xs">۝</span>
                    <div className="h-px w-12 bg-accent/30" />
                  </div>
                </div>
              )}

              <div className="px-5 py-4">
                <p className="font-arabic text-[1.45rem] leading-[2.8] text-foreground text-justify" dir="rtl" style={{ textAlignLast: 'center' }}>
                  {pageVerses.map((verse) => {
                    const isMarked = bookmarkedAyats.has(verse.nomorAyat);
                    return (
                      <span key={verse.nomorAyat} onClick={() => onBookmark(verse.nomorAyat)} className="cursor-pointer">
                        <span className={isMarked ? 'bg-accent/15 rounded px-0.5' : ''}>{verse.teksArab}</span>
                        {' '}
                        <span className={`inline-flex items-center justify-center text-[0.85rem] align-middle select-none ${isMarked ? 'text-accent' : 'text-accent'}`}>
                          ﴿{toArabicNumeral(verse.nomorAyat)}﴾
                        </span>
                        {' '}
                      </span>
                    );
                  })}
                </p>
              </div>

              <div className="text-center pb-3">
                <span className="font-arabic text-xs text-muted-foreground">─ {toArabicNumeral(currentPage + 1)} ─</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-card/90 backdrop-blur border-t border-border">
        <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 text-foreground hover:bg-muted">
          <ChevronRight className="w-4 h-4" /><span>السابق</span>
        </button>
        <span className="text-xs text-muted-foreground font-medium">{currentPage + 1} / {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage <= 0}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 text-foreground hover:bg-muted">
          <span>التالي</span><ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SurahDetailPage;
