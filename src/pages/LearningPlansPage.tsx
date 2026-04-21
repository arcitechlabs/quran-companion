import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Target, Calendar, Flame, CheckCircle, Trophy } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LearningGoal {
  id: string;
  name: string;
  type: 'daily_verses' | 'surah_completion' | 'streak_days';
  target: number;
  current: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  streak: number;
}

const LearningPlansPage = () => {
  const navigate = useNavigate();
  const { learningGoals, addLearningGoal, updateLearningGoal, deleteLearningGoal } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'daily_verses' as const,
    target: 1,
    endDate: '',
  });

  const handleAddGoal = () => {
    if (!newGoal.name || newGoal.target <= 0) return;

    addLearningGoal({
      name: newGoal.name,
      type: newGoal.type,
      target: newGoal.target,
      startDate: new Date().toISOString(),
      endDate: newGoal.endDate || undefined,
      isActive: true,
    });

    setNewGoal({ name: '', type: 'daily_verses', target: 1, endDate: '' });
    setIsAddDialogOpen(false);
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'daily_verses': return <Target className="w-4 h-4" />;
      case 'surah_completion': return <CheckCircle className="w-4 h-4" />;
      case 'streak_days': return <Flame className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'daily_verses': return 'Ayat per Hari';
      case 'surah_completion': return 'Selesai Surah';
      case 'streak_days': return 'Streak Hari';
      default: return type;
    }
  };

  const activeGoals = learningGoals.filter(g => g.isActive);
  const completedGoals = learningGoals.filter(g => !g.isActive);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Learning Plans</h1>
            <p className="text-xs text-muted-foreground">Track your Quran learning goals</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Learning Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Read 5 ayat daily"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Goal Type</Label>
                  <Select value={newGoal.type} onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily_verses">Daily Verses</SelectItem>
                      <SelectItem value="surah_completion">Surah Completion</SelectItem>
                      <SelectItem value="streak_days">Streak Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Active Goals
            </h2>
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getGoalIcon(goal.type)}
                        <h3 className="font-medium">{goal.name}</h3>
                      </div>
                      <Badge variant="secondary">{getGoalTypeLabel(goal.type)}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.current} / {goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      {goal.streak > 0 && (
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Flame className="w-4 h-4" />
                          {goal.streak} day streak
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Completed Goals
            </h2>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h3 className="font-medium">{goal.name}</h3>
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-600">Completed</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Achieved {goal.target} {getGoalTypeLabel(goal.type).toLowerCase()}
                      {goal.streak > 0 && ` with ${goal.streak} day streak`}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quran in a Year Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Quran in a Year Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Complete the entire Quran in 365 days with daily reading targets.
            </p>
            <Button onClick={() => navigate('/quran')} className="w-full">
              Start Reading
            </Button>
          </CardContent>
        </Card>

        {activeGoals.length === 0 && completedGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Learning Goals Yet</h3>
            <p className="text-muted-foreground mb-4">
              Set your first goal to start tracking your Quran learning progress.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPlansPage;