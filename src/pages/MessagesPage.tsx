import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Pesan</h1>
            <p className="text-xs text-muted-foreground">Permintaan doa dari komunitas</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pesan</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Fitur komunitas pesan sedang dalam pengembangan. Mohon ditunggu update terbaru kami.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
