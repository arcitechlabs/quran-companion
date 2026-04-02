import { useEffect, useState } from 'react';
import { Plus, Play, Pause, RotateCcw } from 'lucide-react';
import { db, type KhatamPlan } from '@/lib/db';

const TOTAL_AYAT = 6236;

const KhatamPage = () => {
  const [plans, setPlans] = useState<KhatamPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [days, setDays] = useState(30);
  const [planName, setPlanName] = useState('');

  const loadPlans = async () => {
    const data = await db.khatamPlans.toArray();
    setPlans(data);
  };

  useEffect(() => { loadPlans(); }, []);

  const createPlan = async () => {
    const dailyTarget = Math.ceil(TOTAL_AYAT / days);
    await db.khatamPlans.add({
      name: planName || `Khatam ${days} Hari`,
      totalDays: days,
      startDate: new Date().toISOString(),
      currentDay: 1,
      completedVerses: 0,
      totalVerses: TOTAL_AYAT,
      isActive: true,
      dailyTarget,
      lastReadSurah: 1,
      lastReadAyat: 1,
    });
    setShowForm(false);
    setPlanName('');
    loadPlans();
  };

  const updateProgress = async (plan: KhatamPlan) => {
    if (!plan.id) return;
    const newCompleted = Math.min(plan.completedVerses + plan.dailyTarget, TOTAL_AYAT);
    await db.khatamPlans.update(plan.id, {
      completedVerses: newCompleted,
      currentDay: plan.currentDay + 1,
    });
    loadPlans();
  };

  const resetPlan = async (planId: number) => {
    await db.khatamPlans.update(planId, {
      completedVerses: 0,
      currentDay: 1,
    });
    loadPlans();
  };

  const deletePlan = async (planId: number) => {
    await db.khatamPlans.delete(planId);
    loadPlans();
  };

  return (
    <div className="min-h-screen pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Target Khatam</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 rounded-lg bg-primary text-primary-foreground transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* New Plan Form */}
      {showForm && (
        <div className="p-4 rounded-xl bg-card border border-border mb-6 animate-fade-in">
          <input
            type="text"
            placeholder="Nama rencana (opsional)"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
          />
          <label className="text-xs text-muted-foreground mb-1 block">
            Target selesai dalam (hari):
          </label>
          <div className="flex gap-2 mb-3">
            {[7, 14, 30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  d === days ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {d} hari
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Target harian: ~{Math.ceil(TOTAL_AYAT / days)} ayat/hari
          </p>
          <button
            onClick={createPlan}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all active:scale-[0.98]"
          >
            Buat Rencana
          </button>
        </div>
      )}

      {/* Plans List */}
      {plans.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground mb-2">Belum ada rencana khatam</p>
          <p className="text-xs text-muted-foreground">Tekan + untuk membuat rencana baru</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => {
            const progress = (plan.completedVerses / plan.totalVerses) * 100;
            const isComplete = plan.completedVerses >= plan.totalVerses;
            return (
              <div key={plan.id} className="p-4 rounded-xl bg-card border border-border animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  <div className="flex gap-1.5">
                    {!isComplete && (
                      <button
                        onClick={() => updateProgress(plan)}
                        className="p-1.5 rounded-lg bg-primary/10 text-primary transition-all active:scale-90"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => resetPlan(plan.id!)}
                      className="p-1.5 rounded-lg bg-muted text-muted-foreground transition-all active:scale-90"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Hari {plan.currentDay}/{plan.totalDays}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {plan.completedVerses}/{plan.totalVerses} ayat ({Math.round(progress)}%)
                  </p>
                </div>
                {isComplete && (
                  <p className="mt-2 text-sm text-primary font-semibold text-center">
                    🎉 Alhamdulillah, Khatam!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KhatamPage;
