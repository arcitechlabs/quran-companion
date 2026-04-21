import { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp, Heart, Star, Shield, Home, Sparkles, Activity, Lightbulb } from 'lucide-react';
import { doaData, categories, type Doa } from '@/lib/doaData';

const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
  switch (category) {
    case 'Taubat': return <Heart className={className} />;
    case 'Rezeki': return <Star className={className} />;
    case 'Harian': return <Home className={className} />;
    case 'Perlindungan': return <Shield className={className} />;
    case 'Ibadah': return <Sparkles className={className} />;
    case 'Kesembuhan': return <Activity className={className} />;
    case "Al-Qur'an": return <BookOpen className={className} />;
    default: return <Lightbulb className={className} />;
  }
};

const DoaPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return doaData.filter((d) => {
      const matchCat = activeCategory === 'Semua' || d.category === activeCategory;
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.translation.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Search & Header Section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Kumpulan Doa</h1>
            <p className="text-xs text-muted-foreground">{doaData.length} doa pilihan untuk Anda</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Cari doa berdasarkan judul atau arti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                  : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Doa List */}
        <div className="grid gap-3">
          {filtered.map((doa) => {
            const isExpanded = expandedId === doa.id;
            return (
              <div
                key={doa.id}
                className={`group rounded-2xl border transition-all duration-300 ${
                  isExpanded 
                    ? 'bg-card border-primary/30 shadow-lg' 
                    : 'bg-card/50 border-border hover:border-primary/20'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : doa.id)}
                  className="w-full text-left p-4 flex items-start gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isExpanded ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <CategoryIcon category={doa.category} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">{doa.category}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[10px] text-muted-foreground">{doa.source}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">{doa.title}</h3>
                  </div>
                  
                  <div className={`mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="font-arabic text-right text-2xl leading-[2.2] text-foreground" dir="rtl">
                        {doa.arabic}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Latin</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <p className="text-sm text-primary font-medium italic leading-relaxed text-center px-2">
                        {doa.latin}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Terjemahan</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed text-center italic">
                        "{doa.translation}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">Tidak ada doa yang ditemukan</p>
              <p className="text-xs text-muted-foreground mt-1">Coba kata kunci lain atau pilih kategori yang berbeda</p>
              <button 
                onClick={() => { setSearch(''); setActiveCategory('Semua'); }}
                className="mt-4 text-xs font-bold text-primary hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoaPage;
