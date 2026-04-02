import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSurahs, fetchAndSyncSurahs } from '@/lib/api';
import type { Surah } from '@/lib/db';

const QuranPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      await fetchAndSyncSurahs();
      const data = await getSurahs();
      setSurahs(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
      s.arti.toLowerCase().includes(search.toLowerCase()) ||
      String(s.nomor).includes(search)
  );

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="px-4 mb-4">
        <h1 className="text-xl font-bold text-foreground mb-4">Al-Qur'an</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari surah..."
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
      ) : (
        <div className="px-4 space-y-2">
          {filtered.map((surah) => (
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
      )}
    </div>
  );
};

export default QuranPage;
