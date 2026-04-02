import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getVerses } from '@/lib/api';
import { db } from '@/lib/db';
import type { Surah, Verse } from '@/lib/db';

const SurahDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

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
          <p className="font-arabic text-xl text-primary">{surah?.nama}</p>
        </div>
      </div>

      {/* Bismillah */}
      {surah && surah.nomor !== 1 && surah.nomor !== 9 && (
        <div className="text-center py-6 px-4">
          <p className="font-arabic text-2xl text-primary leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Verses */}
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
    </div>
  );
};

export default SurahDetailPage;
