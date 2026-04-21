import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, setDarkMode } = useAppStore();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Profil</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-6 mb-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">Pengguna Baru</h2>
              <p className="text-sm text-muted-foreground">Bergabung dengan komunitas Al-Islamic</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground px-1">Pengaturan</h3>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {isDarkMode ? '🌙' : '☀️'}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Tema</p>
                <p className="text-xs text-muted-foreground">{isDarkMode ? 'Gelap' : 'Terang'}</p>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-muted'}`}>
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>

          {/* More Settings Coming */}
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Pengaturan Lanjutan</p>
                <p className="text-xs text-muted-foreground">Segera hadir</p>
              </div>
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            Al-Islamic v1.0.0<br />
            Build dengan ❤️ untuk komunitas Islam
          </p>
        </div>

        {/* Logout Button */}
        <button className="w-full mt-6 flex items-center justify-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
