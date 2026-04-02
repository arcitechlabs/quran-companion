import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, Loader2, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function calculateQiblaDirection(lat: number, lng: number): number {
  const lat1 = toRadians(lat);
  const lat2 = toRadians(KAABA_LAT);
  const dLng = toRadians(KAABA_LNG - lng);

  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

function calculateDistance(lat: number, lng: number): number {
  const R = 6371;
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat)) * Math.cos(toRadians(KAABA_LAT)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const QiblaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);
  const [distance, setDistance] = useState(0);
  const [locationName, setLocationName] = useState('');
  const [hasCompass, setHasCompass] = useState(false);
  const [userLat, setUserLat] = useState(0);
  const [userLng, setUserLng] = useState(0);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading = event.alpha;
    if (heading === null || heading === undefined) return;

    const webkit = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
    if (webkit.webkitCompassHeading !== undefined) {
      heading = webkit.webkitCompassHeading;
    } else {
      heading = 360 - heading;
    }

    setCompassHeading(heading);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        let lat = -6.2088;
        let lng = 106.8456;

        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, enableHighAccuracy: true })
          );
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setLocationName('Jakarta (default)');
        }

        setUserLat(lat);
        setUserLng(lng);
        setQiblaDirection(calculateQiblaDirection(lat, lng));
        setDistance(calculateDistance(lat, lng));
        setLoading(false);

        if (typeof DeviceOrientationEvent !== 'undefined') {
          const DONT = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
          if (typeof DONT.requestPermission === 'function') {
            try {
              const permission = await DONT.requestPermission();
              if (permission === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
                setHasCompass(true);
              }
            } catch {
              setHasCompass(false);
            }
          } else {
            window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
            setHasCompass(true);
          }
        }
      } catch {
        setError('Gagal memuat data lokasi');
        setLoading(false);
      }
    };

    init();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener);
    };
  }, [handleOrientation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Arah Kiblat</h1>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{locationName}</p>
        <span className="text-xs text-muted-foreground">• {distance} km ke Makkah</span>
      </div>

      {/* Compass */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-64">
          {/* Compass ring */}
          <div className="absolute inset-0 rounded-full border-2 border-border bg-card/50">
            {/* Cardinal directions */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-foreground">U</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-muted-foreground">S</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">B</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">T</span>
          </div>

          {/* Rotating compass needle */}
          <div
            className="absolute inset-4 transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Qibla arrow (green, pointing to Kaaba) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[24px] border-b-primary" />
            </div>

            {/* Tail */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[16px] border-t-muted-foreground/30" />
            </div>

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-md" />
          </div>
        </div>

        {/* Direction info */}
        <div className="text-center mt-4">
          <p className="text-3xl font-bold text-primary tabular-nums">{Math.round(qiblaDirection)}°</p>
          <p className="text-sm text-muted-foreground mt-1">
            {qiblaDirection >= 337.5 || qiblaDirection < 22.5 ? 'Utara' :
             qiblaDirection >= 22.5 && qiblaDirection < 67.5 ? 'Timur Laut' :
             qiblaDirection >= 67.5 && qiblaDirection < 112.5 ? 'Timur' :
             qiblaDirection >= 112.5 && qiblaDirection < 157.5 ? 'Tenggara' :
             qiblaDirection >= 157.5 && qiblaDirection < 202.5 ? 'Selatan' :
             qiblaDirection >= 202.5 && qiblaDirection < 247.5 ? 'Barat Daya' :
             qiblaDirection >= 247.5 && qiblaDirection < 292.5 ? 'Barat' :
             'Barat Laut'}
            {' dari lokasi Anda'}
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Koordinat Ka'bah</p>
              <p className="text-xs text-muted-foreground">{KAABA_LAT.toFixed(4)}° N, {KAABA_LNG.toFixed(4)}° E</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Jarak ke Makkah</p>
              <p className="text-xs text-muted-foreground">{distance.toLocaleString()} km dari lokasi Anda</p>
            </div>
          </div>
        </div>

        {!hasCompass && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Kompas perangkat tidak tersedia. Gunakan arah {Math.round(qiblaDirection)}° sebagai panduan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;
