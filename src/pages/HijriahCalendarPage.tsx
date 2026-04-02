import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const HIJRI_MONTHS = [
  { name: 'Muharram', arabic: 'مُحَرَّم', days: 30 },
  { name: 'Safar', arabic: 'صَفَر', days: 29 },
  { name: "Rabi'ul Awal", arabic: 'رَبِيع ٱلْأَوَّل', days: 30 },
  { name: "Rabi'ul Akhir", arabic: 'رَبِيع ٱلْآخِر', days: 29 },
  { name: 'Jumadil Awal', arabic: 'جُمَادَىٰ ٱلْأُولَىٰ', days: 30 },
  { name: 'Jumadil Akhir', arabic: 'جُمَادَىٰ ٱلْآخِرَة', days: 29 },
  { name: 'Rajab', arabic: 'رَجَب', days: 30 },
  { name: "Sya'ban", arabic: 'شَعْبَان', days: 29 },
  { name: 'Ramadhan', arabic: 'رَمَضَان', days: 30 },
  { name: 'Syawal', arabic: 'شَوَّال', days: 29 },
  { name: "Dzulqa'dah", arabic: 'ذُو ٱلْقَعْدَة', days: 30 },
  { name: 'Dzulhijjah', arabic: 'ذُو ٱلْحِجَّة', days: 29 },
];

const SPECIAL_DAYS: Record<string, { name: string; color: string }> = {
  '1-1': { name: 'Tahun Baru Hijriyah', color: 'bg-primary/20 text-primary' },
  '1-10': { name: 'Hari Asyura', color: 'bg-accent/20 text-accent' },
  '3-12': { name: 'Maulid Nabi ﷺ', color: 'bg-primary/20 text-primary' },
  '7-27': { name: "Isra Mi'raj", color: 'bg-accent/20 text-accent' },
  '8-15': { name: "Nisfu Sya'ban", color: 'bg-primary/20 text-primary' },
  '9-1': { name: 'Awal Ramadhan', color: 'bg-accent/20 text-accent' },
  '9-17': { name: 'Nuzulul Qur\'an', color: 'bg-primary/20 text-primary' },
  '9-27': { name: 'Lailatul Qadar (malam ke-27)', color: 'bg-accent/20 text-accent' },
  '10-1': { name: 'Idul Fitri', color: 'bg-primary/20 text-primary' },
  '12-1': { name: 'Awal Dzulhijjah', color: 'bg-accent/20 text-accent' },
  '12-9': { name: 'Wukuf Arafah', color: 'bg-primary/20 text-primary' },
  '12-10': { name: 'Idul Adha', color: 'bg-accent/20 text-accent' },
};

// Approximate Gregorian to Hijri conversion (Kuwaiti algorithm)
function gregorianToHijri(date: Date): { day: number; month: number; year: number } {
  const jd = Math.floor((1461 * (date.getFullYear() + 4800 + Math.floor((date.getMonth() - 13) / 12))) / 4)
    + Math.floor((367 * (date.getMonth() - 1 - 12 * Math.floor((date.getMonth() - 13) / 12))) / 12)
    - Math.floor((3 * Math.floor((date.getFullYear() + 4900 + Math.floor((date.getMonth() - 13) / 12)) / 100)) / 4)
    + date.getDate() - 32075;

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719)
    + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
    - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { day, month, year };
}

function hijriToGregorian(day: number, month: number, year: number): Date {
  const jd = Math.floor((11 * year + 3) / 30) + 354 * year + 30 * month
    - Math.floor((month - 1) / 2) + day + 1948440 - 385;
  let l = jd + 68569;
  const n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l) / 2447);
  const d = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  const m = j + 2 - 12 * l;
  const y = 100 * (n - 49) + i + l;
  return new Date(y, m - 1, d);
}

const DAYS_OF_WEEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const HijriahCalendarPage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const todayHijri = gregorianToHijri(today);

  const [viewMonth, setViewMonth] = useState(todayHijri.month);
  const [viewYear, setViewYear] = useState(todayHijri.year);

  const calendarDays = useMemo(() => {
    const firstGreg = hijriToGregorian(1, viewMonth, viewYear);
    const startDow = firstGreg.getDay();

    const days: { hijriDay: number; gregDate: Date; isCurrentMonth: boolean; isToday: boolean; special?: { name: string; color: string } }[] = [];

    // Days before month starts
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(firstGreg);
      d.setDate(d.getDate() - i - 1);
      const h = gregorianToHijri(d);
      days.push({ hijriDay: h.day, gregDate: d, isCurrentMonth: false, isToday: false });
    }

    // Days in month
    const monthInfo = HIJRI_MONTHS[viewMonth - 1];
    for (let d = 1; d <= monthInfo.days; d++) {
      const greg = hijriToGregorian(d, viewMonth, viewYear);
      const isToday = greg.toDateString() === today.toDateString();
      const key = `${viewMonth}-${d}`;
      days.push({
        hijriDay: d,
        gregDate: greg,
        isCurrentMonth: true,
        isToday,
        special: SPECIAL_DAYS[key],
      });
    }

    // Fill remaining
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
      const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;
      const greg = hijriToGregorian(i, nextMonth, nextYear);
      days.push({ hijriDay: i, gregDate: greg, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [viewMonth, viewYear]);

  const goPrev = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goNext = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthInfo = HIJRI_MONTHS[viewMonth - 1];

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Kalender Hijriyah</h1>
      </div>

      {/* Today card */}
      <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/15">
        <p className="text-xs text-muted-foreground">Hari ini</p>
        <p className="text-2xl font-bold text-foreground font-arabic">{todayHijri.day} {monthInfo?.arabic} {todayHijri.year}</p>
        <p className="text-sm text-muted-foreground">{today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{monthInfo.name} {viewYear}</p>
          <p className="text-xs text-muted-foreground font-arabic">{monthInfo.arabic}</p>
        </div>
        <button onClick={goNext} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-colors ${
              day.isToday ? 'bg-primary text-primary-foreground font-bold' :
              day.special ? `${day.special.color} font-medium` :
              day.isCurrentMonth ? 'bg-card border border-border text-foreground' :
              'text-muted-foreground'
            }`}
          >
            <span>{day.hijriDay}</span>
            {day.special && <Star className="w-2 h-2 absolute top-1 right-1" />}
          </div>
        ))}
      </div>

      {/* Special days list */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Hari Penting Bulan Ini</h2>
        {Object.entries(SPECIAL_DAYS)
          .filter(([key]) => key.startsWith(`${viewMonth}-`))
          .map(([key, info]) => {
            const day = key.split('-')[1];
            const greg = hijriToGregorian(Number(day), viewMonth, viewYear);
            return (
              <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border mb-2">
                <div className={`w-10 h-10 rounded-lg ${info.color} flex items-center justify-center flex-shrink-0`}>
                  <Star className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{info.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {day} {monthInfo.name} {viewYear} — {greg.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            );
          })}
        {Object.entries(SPECIAL_DAYS).filter(([key]) => key.startsWith(`${viewMonth}-`)).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">Tidak ada hari khusus di bulan ini</p>
        )}
      </div>
    </div>
  );
};

export default HijriahCalendarPage;
