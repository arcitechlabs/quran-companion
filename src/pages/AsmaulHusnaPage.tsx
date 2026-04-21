import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { asmaulHusnaData } from '@/lib/asmaulHusnaData';

const AsmaulHusnaPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = asmaulHusnaData.filter(item => 
    item.latin.toLowerCase().includes(search.toLowerCase()) || 
    item.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Asmaul Husna</h1>
            <p className="text-xs text-muted-foreground">99 Nama Allah yang Indah</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama atau arti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative p-5 rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="font-arabic text-6xl">{item.arabic}</span>
              </div>
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-4">
                  <span className="text-xs font-bold text-primary">{item.id}</span>
                </div>
                <p className="font-arabic text-3xl text-primary leading-relaxed" dir="rtl">{item.arabic}</p>
              </div>
              
              <div className="relative z-10 mt-2">
                <h3 className="text-lg font-bold text-foreground">{item.latin}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.meaning}</p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-muted-foreground text-sm">Tidak ada nama yang cocok dengan "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsmaulHusnaPage;
