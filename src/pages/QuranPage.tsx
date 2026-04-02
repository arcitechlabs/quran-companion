import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TextSearch } from 'lucide-react';
import { getSurahs, fetchAndSyncSurahs } from '@/lib/api';
import { JUZ_DATA } from '@/lib/juzData';
import type { Surah } from '@/lib/db';

type TabMode = 'surah' | 'juz';

const QuranPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surahMap, setSurahMap] = useState<Record<number, Surah>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabMode>('surah');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchAndSyncSurahs();
      const data = await getSurahs();
      setSurahs(data);
      const map: Record<number, Surah> = {};
      data.forEach(s => { map[s.nomor] = s; });
      setSurahMap(map);
      setLoading(false);
    };
    load();
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      String(s.nomor).includes(search)
  );

  const filteredJuz = search
    ? JUZ_DATA.filter(j => {
        const startName = surahMap[j.startSurah]?.namaLatin || '';
        return String(j.juz).includes(search) || startName.toLowerCase().includes(search.toLowerCase());
      })
    : JUZ_DATA;

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Al-Qur'an</h1>
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="Cari ayat"
          >
            <TextSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTab('surah')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'surah' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => setTab('juz')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === 'juz' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            Juz
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={tab === 'surah' ? 'Cari surah...' : 'Cari juz...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="px-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : tab === 'surah' ? (
        <div className="px-4 space-y-2">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.nomor}
              onClick={() => navigate(`/quran/${surah.nomor}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border transition-all active:scale-[0.98] hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary">{surah.nomor}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{surah.namaLatin}</p>
                <p className="text-xs text-muted-foreground">
                  {surah.tempatTurun} • {surah.jumlahAyat} Ayat • {surah.arti}
                </p>
              </div>
              <p className="font-arabic text-lg text-primary flex-shrink-0">{surah.nama}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {filteredJuz.map((j) => {
            const startSurah = surahMap[j.startSurah];
            return (
              <button
                key={j.juz}
                onClick={() => navigate(`/juz/${j.juz}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border transition-all active:scale-[0.98] hover:shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-accent">{j.juz}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground">Juz {j.juz}</p>
                  <p className="text-xs text-muted-foreground">
                    {startSurah?.namaLatin || `Surah ${j.startSurah}`} ayat {j.startAyat}
                    {j.startSurah !== j.endSurah && ` — ${surahMap[j.endSurah]?.namaLatin || `Surah ${j.endSurah}`} ayat ${j.endAyat}`}
                  </p>
                </div>
                <p className="font-arabic text-sm text-primary flex-shrink-0">{startSurah?.nama}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuranPage;
