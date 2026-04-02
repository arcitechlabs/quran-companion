import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import AudioPlayer from "@/components/AudioPlayer";
import HomePage from "./pages/HomePage";
import QuranPage from "./pages/QuranPage";
import SurahDetailPage from "./pages/SurahDetailPage";
import JuzDetailPage from "./pages/JuzDetailPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import DzikirPage from "./pages/DzikirPage";
import KhatamPage from "./pages/KhatamPage";
import DoaPage from "./pages/DoaPage";
import SearchPage from "./pages/SearchPage";
import QiblaPage from "./pages/QiblaPage";
import HijriahCalendarPage from "./pages/HijriahCalendarPage";
import ZakatPage from "./pages/ZakatPage";
import FastingPage from "./pages/FastingPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useAppStore } from "./stores/appStore";

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
    <div className="max-w-lg mx-auto min-h-screen relative">
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AudioPlayer />
      <BottomNav />
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
