import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Clock, Hand, BookHeart } from 'lucide-react';

const tabs = [
  { id: 'home', icon: Home, label: 'Beranda', path: '/' },
  { id: 'quran', icon: BookOpen, label: "Al-Qur'an", path: '/quran' },
  { id: 'prayer', icon: Clock, label: 'Shalat', path: '/prayer-times' },
  { id: 'dzikir', icon: Hand, label: 'Dzikir', path: '/dzikir' },
  { id: 'doa', icon: BookHeart, label: 'Doa', path: '/doa' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border dark:bg-slate-900/90 safe-bottom">
      <div className="mx-auto flex max-w-5xl items-center justify-around h-16 px-2 sm:px-4">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full rounded-lg transition-all ${
                active
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
