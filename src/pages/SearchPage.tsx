import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';
import { searchVerses } from '@/lib/api';
import { db } from '@/lib/db';
import type { Verse, Surah } from '@/lib/db';

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);
  const [surahMap, setSurahMap] = useState<Record<number, Surah>>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const found = await searchVerses(value);
    setResults(found);

    // Load surah names for results
    const surahNumbers = [...new Set(found.map(v => v.surahNomor))];
    const surahs = await db.surahs.bulkGet(surahNumbers);
    const map: Record<number, Surah> = {};
    surahs.forEach(s => { if (s) map[s.nomor] = s; });
    setSurahMap(map);

    setLoading(false);
  }, []);

  const highlightMatch = (text: string, q: string) => {
    if (!q || q.trim().length < 2) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <mark className="bg-primary/20 text-foreground rounded px-0.5">{match}</mark>
        {after}
      </>
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Cari Ayat</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari di seluruh ayat Al-Qur'an..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-sm text-muted-foreground">Tidak ditemukan ayat yang cocok dengan "{query}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="px-4">
          <p className="text-xs text-muted-foreground mb-3">{results.length} ayat ditemukan</p>
          <div className="space-y-2">
            {results.slice(0, 50).map((verse) => {
              const surah = surahMap[verse.surahNomor];
              return (
                <button
                  key={`${verse.surahNomor}-${verse.nomorAyat}`}
                  onClick={() => navigate(`/quran/${verse.surahNomor}`)}
                  className="w-full text-left p-3 rounded-xl bg-card border border-border transition-all active:scale-[0.98] hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{verse.surahNomor}:{verse.nomorAyat}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">
                        {surah?.namaLatin || `Surah ${verse.surahNomor}`}
                      </p>
                    </div>
                    <p className="font-arabic text-sm text-primary">{surah?.nama}</p>
                  </div>
                  <p className="font-arabic text-right text-base leading-relaxed text-foreground mb-1.5" dir="rtl">
                    {verse.teksArab.length > 120 ? verse.teksArab.slice(0, 120) + '...' : verse.teksArab}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {highlightMatch(
                      verse.teksIndonesia.length > 150 ? verse.teksIndonesia.slice(0, 150) + '...' : verse.teksIndonesia,
                      query
                    )}
                  </p>
                </button>
              );
            })}
            {results.length > 50 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                Menampilkan 50 dari {results.length} hasil. Gunakan kata kunci yang lebih spesifik.
              </p>
            )}
          </div>
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-12 px-4">
          <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Ketik kata kunci untuk mencari ayat</p>
          <p className="text-xs text-muted-foreground mt-1">Cari dalam bahasa Indonesia, Latin, atau Arab</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
