import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Clock, Hand, Target } from 'lucide-react';

const tabs = [
  { id: 'home', icon: Home, label: 'Beranda', path: '/' },
  { id: 'quran', icon: BookOpen, label: "Al-Qur'an", path: '/quran' },
  { id: 'prayer', icon: Clock, label: 'Shalat', path: '/prayer-times' },
  { id: 'dzikir', icon: Hand, label: 'Dzikir', path: '/dzikir' },
  { id: 'khatam', icon: Target, label: 'Khatam', path: '/khatam' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
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
