import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Sparkles } from 'lucide-react';
import { kisahNabiData } from '@/lib/kisahNabiData';

const KisahNabiPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = kisahNabiData.filter((item) => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
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
            <h1 className="text-xl font-bold text-foreground">Kisah 25 Nabi</h1>
            <p className="text-xs text-muted-foreground">Sejarah Nabi dan Rasul (Sirah)</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nabi atau mukjizat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6 relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-border hidden md:block" />

        {filtered.map((item) => (
          <div key={item.id} className="relative z-10 flex flex-col md:flex-row gap-4 md:items-start group">
            {/* Timeline dot */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 md:mt-1 shadow-[0_0_0_6px_var(--background)]">
              {item.id}
            </div>

            <div className="flex-1 bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <span className="font-arabic text-8xl">{item.arabic}</span>
              </div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
                <span className="font-arabic text-2xl text-primary">{item.arabic}</span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative z-10 text-justify">
                {item.description}
              </p>

              {item.miracles.length > 0 && (
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-foreground">Mukjizat & Keistimewaan:</span>
                  </div>
                  <ul className="space-y-1.5">
                    {item.miracles.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span> <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">Tidak ada kisah nabi yang cocok dengan pencarian Anda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KisahNabiPage;
