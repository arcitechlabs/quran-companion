import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Coins, Wheat } from 'lucide-react';

const ZAKAT_NISAB_GRAM = 85; // gram emas
const ZAKAT_RATE = 0.025; // 2.5%

const ZakatPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'maal' | 'fitrah'>('maal');

  // Zakat Maal state
  const [goldGram, setGoldGram] = useState('');
  const [goldPrice, setGoldPrice] = useState('');
  const [cash, setCash] = useState('');
  const [savings, setSavings] = useState('');
  const [receivables, setReceivables] = useState('');
  const [stocks, setStocks] = useState('');
  const [otherAssets, setOtherAssets] = useState('');
  const [debts, setDebts] = useState('');

  // Zakat Fitrah state
  const [familyMembers, setFamilyMembers] = useState('1');
  const [ricePrice, setRicePrice] = useState('15000');

  const calculateMaal = () => {
    const goldValue = (Number(goldGram) || 0) * (Number(goldPrice) || 0);
    const totalAssets =
      goldValue +
      (Number(cash) || 0) +
      (Number(savings) || 0) +
      (Number(receivables) || 0) +
      (Number(stocks) || 0) +
      (Number(otherAssets) || 0);
    const netAssets = totalAssets - (Number(debts) || 0);
    const nisabValue = ZAKAT_NISAB_GRAM * (Number(goldPrice) || 0);
    const isObligated = netAssets >= nisabValue && netAssets > 0;
    const zakatAmount = isObligated ? netAssets * ZAKAT_RATE : 0;

    return { totalAssets, netAssets, nisabValue, isObligated, zakatAmount, goldValue };
  };

  const calculateFitrah = () => {
    const members = Number(familyMembers) || 1;
    const price = Number(ricePrice) || 15000;
    const amountPerPerson = 2.5 * price; // 2.5 kg beras per orang
    const total = members * amountPerPerson;
    return { members, amountPerPerson, total };
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const maal = calculateMaal();
  const fitrah = calculateFitrah();

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Kalkulator Zakat</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('maal')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'maal' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
          }`}
        >
          <Coins className="w-4 h-4" />
          Zakat Maal
        </button>
        <button
          onClick={() => setTab('fitrah')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            tab === 'fitrah' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'
          }`}
        >
          <Wheat className="w-4 h-4" />
          Zakat Fitrah
        </button>
      </div>

      {tab === 'maal' ? (
        <div className="space-y-4">
          {/* Input fields */}
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Aset</h3>

            <div>
              <label className="text-xs text-muted-foreground">Emas (gram)</label>
              <input type="number" value={goldGram} onChange={e => setGoldGram(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Harga emas per gram (Rp)</label>
              <input type="number" value={goldPrice} onChange={e => setGoldPrice(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Uang tunai (Rp)</label>
              <input type="number" value={cash} onChange={e => setCash(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Tabungan & deposito (Rp)</label>
              <input type="number" value={savings} onChange={e => setSavings(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Piutang (Rp)</label>
              <input type="number" value={receivables} onChange={e => setReceivables(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Saham & investasi (Rp)</label>
              <input type="number" value={stocks} onChange={e => setStocks(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Aset lainnya (Rp)</label>
              <input type="number" value={otherAssets} onChange={e => setOtherAssets(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Hutang</h3>
            <div>
              <label className="text-xs text-muted-foreground">Total hutang (Rp)</label>
              <input type="number" value={debts} onChange={e => setDebts(e.target.value)} placeholder="0"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          {/* Result */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/15">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Hasil Perhitungan</h3>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nilai emas</span>
                <span className="text-foreground">{formatCurrency(maal.goldValue)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total aset</span>
                <span className="text-foreground">{formatCurrency(maal.totalAssets)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Aset bersih (setelah hutang)</span>
                <span className="text-foreground">{formatCurrency(maal.netAssets)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Nisab (85g emas)</span>
                <span className="text-foreground">{formatCurrency(maal.nisabValue)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              {maal.isObligated ? (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Anda wajib zakat</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(maal.zakatAmount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">2.5% dari aset bersih</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Aset bersih belum mencapai nisab</p>
                  {maal.netAssets > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Kurang {formatCurrency(maal.nisabValue - maal.netAssets)} lagi
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Jumlah anggota keluarga</label>
              <input type="number" value={familyMembers} onChange={e => setFamilyMembers(e.target.value)} min="1" placeholder="1"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Harga beras per kg (Rp)</label>
              <input type="number" value={ricePrice} onChange={e => setRicePrice(e.target.value)} placeholder="15000"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/15">
            <div className="flex items-center gap-2 mb-3">
              <Wheat className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Hasil Perhitungan</h3>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Jiwa</span>
                <span className="text-foreground">{fitrah.members} orang</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">2.5 kg beras/orang</span>
                <span className="text-foreground">{formatCurrency(fitrah.amountPerPerson)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Zakat Fitrah</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(fitrah.total)}</p>
              <p className="text-xs text-muted-foreground mt-1">Atau 2.5 kg beras x {fitrah.members} orang</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">Info Zakat Fitrah</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Wajib bagi setiap muslim (laki & perempuan)</li>
              <li>• Dibayar sebelum shalat Idul Fitri</li>
              <li>• Bisa dibayar dalam bentuk beras atau uang</li>
              <li>• Boleh diwakilkan untuk anggota keluarga</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZakatPage;
