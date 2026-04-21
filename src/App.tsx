import React, { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import AudioPlayer from "@/components/AudioPlayer";
import { useAppStore } from "./stores/appStore";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const QuranPage = React.lazy(() => import("./pages/QuranPage"));
const SurahDetailPage = React.lazy(() => import("./pages/SurahDetailPage"));
const JuzDetailPage = React.lazy(() => import("./pages/JuzDetailPage"));
const PrayerTimesPage = React.lazy(() => import("./pages/PrayerTimesPage"));
const DzikirPage = React.lazy(() => import("./pages/DzikirPage"));
const KhatamPage = React.lazy(() => import("./pages/KhatamPage"));
const DoaPage = React.lazy(() => import("./pages/DoaPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const QiblaPage = React.lazy(() => import("./pages/QiblaPage"));
const HijriahCalendarPage = React.lazy(() => import("./pages/HijriahCalendarPage"));
const ZakatPage = React.lazy(() => import("./pages/ZakatPage"));
const FastingPage = React.lazy(() => import("./pages/FastingPage"));
const AsmaulHusnaPage = React.lazy(() => import("./pages/AsmaulHusnaPage"));
const KisahNabiPage = React.lazy(() => import("./pages/KisahNabiPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppContent = () => {
  const { isDarkMode, setOnline } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [setOnline]);

  return (
    <div className="max-w-full mx-auto min-h-screen relative bg-background text-foreground lg:max-w-5xl">
      <div className="px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Memuat konten...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/quran/:id" element={<SurahDetailPage />} />
            <Route path="/juz/:id" element={<JuzDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/qibla" element={<QiblaPage />} />
            <Route path="/hijriah" element={<HijriahCalendarPage />} />
            <Route path="/zakat" element={<ZakatPage />} />
            <Route path="/fasting" element={<FastingPage />} />
            <Route path="/prayer-times" element={<PrayerTimesPage />} />
            <Route path="/dzikir" element={<DzikirPage />} />
            <Route path="/khatam" element={<KhatamPage />} />
            <Route path="/doa" element={<DoaPage />} />
            <Route path="/asmaul-husna" element={<AsmaulHusnaPage />} />
            <Route path="/kisah-nabi" element={<KisahNabiPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <AudioPlayer />
        <BottomNav />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
