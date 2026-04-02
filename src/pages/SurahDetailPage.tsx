import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, List } from 'lucide-react';
import { getVerses } from '@/lib/api';
import { db } from '@/lib/db';
import type { Surah, Verse } from '@/lib/db';

type ViewMode = 'terjemah' | 'mushaf';

const toArabicNumeral = (n: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).split('').map(d => arabicDigits[parseInt(d)]).join('');
};

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('terjemah');

  useEffect(() => {
    const load = async () => {
      const num = Number(id);
      const s = await db.surahs.get(num);
      setSurah(s || null);
      const v = await getVerses(num);
      setVerses(v);
      setLoading(false);
    };
    load();
  }, [id]);

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

          {/* View Mode Toggle */}
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
        <MushafView surah={surah} verses={verses} />
      ) : (
        <TerjemahView surah={surah} verses={verses} />
      )}
    </div>
  );
};

/* ── Terjemah View (Original) ── */
const TerjemahView = ({ surah, verses }: { surah: Surah | null; verses: Verse[] }) => (
  <>
    {surah && surah.nomor !== 1 && surah.nomor !== 9 && (
      <div className="text-center py-6 px-4">
        <p className="font-arabic text-2xl text-primary leading-loose">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    )}
    <div className="px-4 space-y-4 py-4">
      {verses.map((verse) => (
        <div key={verse.nomorAyat} className="p-4 rounded-xl bg-card border border-border animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{verse.nomorAyat}</span>
            </div>
          </div>
          <p className="font-arabic text-right text-xl leading-[2.5] text-foreground mb-4" dir="rtl">
            {verse.teksArab}
          </p>
          <p className="text-sm text-primary/80 italic mb-2">{verse.teksLatin}</p>
          <p className="text-sm text-muted-foreground">{verse.teksIndonesia}</p>
        </div>
      ))}
    </div>
  </>
);

/* ── Mushaf View (Printed Quran Style) ── */
const MushafView = ({ surah, verses }: { surah: Surah | null; verses: Verse[] }) => (
  <div className="mushaf-container px-3 py-4">
    {/* Surah Header Ornament */}
    <div className="mushaf-surah-header mx-auto mb-6 max-w-md">
      <div className="relative border-2 border-accent rounded-2xl py-4 px-6 text-center bg-accent/5">
        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl-2xl -translate-x-px -translate-y-px" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr-2xl translate-x-px -translate-y-px" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl-2xl -translate-x-px translate-y-px" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br-2xl translate-x-px translate-y-px" />

        <p className="font-arabic text-3xl text-foreground leading-relaxed mb-1">
          سُورَةُ {surah?.nama?.replace(/[^\u0600-\u06FF\s]/g, '') || surah?.nama}
        </p>
        <p className="font-arabic text-sm text-muted-foreground">
          {surah?.tempatTurun === 'Mekah' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} - {surah?.jumlahAyat && toArabicNumeral(surah.jumlahAyat)} آيَات
        </p>
      </div>
    </div>

    {/* Bismillah */}
    {surah && surah.nomor !== 1 && surah.nomor !== 9 && (
      <div className="text-center mb-6">
        <p className="font-arabic text-[1.7rem] text-foreground leading-loose">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>
    )}

    {/* Continuous Arabic Text (like a printed mushaf) */}
    <div className="mushaf-page border border-border rounded-2xl bg-card p-5 shadow-sm">
      <div className="mushaf-border border border-accent/20 rounded-xl p-4">
        <p className="font-arabic text-[1.55rem] leading-[3] text-foreground text-justify" dir="rtl" style={{ textAlignLast: 'center' }}>
          {verses.map((verse, idx) => (
            <span key={verse.nomorAyat}>
              {verse.teksArab}
              {' '}
              <span className="inline-flex items-center justify-center text-accent text-base align-middle mx-0.5 select-none">
                ﴿{toArabicNumeral(verse.nomorAyat)}﴾
              </span>
              {' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  </div>
);

export default SurahDetailPage;
