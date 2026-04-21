import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookmarkCheck } from 'lucide-react';
import { db } from '@/lib/db';
import type { Bookmark } from '@/lib/db';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const bmarks = await db.bookmarks
          .filter(b => !b.isLastRead)
          .reverse()
          .sortBy('createdAt');
        setBookmarks(bmarks);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Tilawahku</h1>
            <p className="text-xs text-muted-foreground">Ayat yang telah Anda tandai</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Belum ada ayat yang ditandai</p>
            <button
              onClick={() => navigate('/quran')}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
            >
              Mulai Membaca Al-Qur'an
            </button>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => navigate(`/quran/${bookmark.surahNomor}`)}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border transition-all active:scale-[0.98] hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{bookmark.nomorAyat}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground">{bookmark.surahNamaLatin}</p>
                <p className="text-xs text-muted-foreground">Ayat {bookmark.nomorAyat}</p>
              </div>
              <p className="font-arabic text-lg text-primary flex-shrink-0">{bookmark.surahNama}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
