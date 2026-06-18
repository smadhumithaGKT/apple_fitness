import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ActivityState, DailyTargets, Workout, SummaryMetric, FriendActivity } from './types';
import { 
  INITIAL_DAILY_TARGETS, 
  INITIAL_ACTIVITY_STATE, 
  INITIAL_WORKOUTS, 
  INITIAL_METRICS 
} from './data';

// Component Imports
import ActivityRings from './components/ActivityRings';
import SummaryCards from './components/SummaryCards';
import MetricDetailModal from './components/MetricDetailModal';
import WorkoutsSection from './components/WorkoutsSection';
import FitnessTab from './components/FitnessTab';
import SharingTab from './components/SharingTab';
import ProfileTab from './components/ProfileTab';

// Lucide Icons
import { 
  TrendingUp, 
  PlayCircle, 
  Users, 
  User, 
  Heart, 
  Activity, 
  Tv, 
  Smartphone, 
  Wifi, 
  Battery, 
  Sparkles,
  Award,
  LogOut,
  Target
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'Summary' | 'Fitness' | 'Sharing' | 'Profile'>('Summary');

  // Core Coupled States
  const [targets, setTargets] = useState<DailyTargets>(INITIAL_DAILY_TARGETS);
  const [activity, setActivity] = useState<ActivityState>(INITIAL_ACTIVITY_STATE);
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);

  // Selected card modal overlay state
  const [selectedMetric, setSelectedMetric] = useState<SummaryMetric | null>(null);

  // Syncing / Live Clock
  const [systemTime, setSystemTime] = useState<string>('');
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute dynamic summary metrics based on active calorie state changes
  const computedMetrics = INITIAL_METRICS(activity).map(orig => {
    // Keep internal values coupled to the Live Activity state variables
    if (orig.id === 'calories') {
      return {
        ...orig,
        value: String(activity.moveCurrent),
        sparkline: [...orig.sparkline.slice(0, -1), activity.moveCurrent]
      };
    }
    return orig;
  });

  // Action: Add new custom workout and update concentric ring percentages
  const handleAddWorkout = (workoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      id: `w-${Date.now()}`,
      ...workoutData,
    };

    setWorkouts(prev => [newWorkout, ...prev]);

    // Reactively boost rings!
    // Adding a workout burns active calories (Move ring) and contributes minutes (Exercise ring)
    setActivity(prev => {
      const newMove = Math.min(prev.moveCurrent + newWorkout.caloriesBurned, targets.moveGoal * 2);
      const newExercise = Math.min(prev.exerciseCurrent + newWorkout.durationMinutes, targets.exerciseGoal * 2);
      
      // Let's also close 1 stand hour if workout is high density
      const newStand = Math.min(prev.standCurrent + (newWorkout.durationMinutes >= 15 ? 1 : 0), targets.standGoal * 1.5);

      return {
        moveCurrent: newMove,
        exerciseCurrent: newExercise,
        standCurrent: newStand,
      };
    });
  };

  // Action: Log items from Detail Modal input
  const handleLogData = (metricId: string, loggedValue: number) => {
    // Update core rings based on category logged
    setActivity(prev => {
      if (metricId === 'calories') {
        return { ...prev, moveCurrent: Math.min(Math.round(prev.moveCurrent + loggedValue), targets.moveGoal * 2.5) };
      }
      if (metricId === 'steps') {
        // Steps also translate roughly to calories (e.g. 100 steps ≈ 4 kcal)
        const activeKcal = Math.round(loggedValue * 0.04);
        return { 
          ...prev, 
          moveCurrent: Math.min(Math.round(prev.moveCurrent + activeKcal), targets.moveGoal * 2.5)
        };
      }
      return prev;
    });

    // Update state variables for secondary items like Sleep hours, Mindfulness, or Heart rate averages if available
    setSelectedMetric(prev => {
      if (!prev) return null;
      let nextVal = parseFloat(prev.value.replace(/[^0-9.]/g, '')) + loggedValue;
      
      // Format correctly
      let nextStr = String(Math.round(nextVal));
      if (prev.id === 'sleep') {
        const totalHrs = nextVal / 10 >= 1 ? nextVal / 10 : nextVal; // Adjust to sound hours
        nextStr = `${Math.floor(totalHrs)}h ${Math.round((totalHrs % 1) * 60)}m`;
      }
      if (prev.id === 'distance') {
        nextStr = (parseFloat(prev.value) + loggedValue).toFixed(1);
      }

      return {
        ...prev,
        value: nextStr,
        sparkline: [...prev.sparkline.slice(0, -1), Math.round(nextVal)]
      };
    });
  };

  return (
    <div id="applet-viewport" className="min-h-screen bg-black text-white selection:bg-move-pink selection:text-white pb-32">
      
      {/* 1. TOP DEVICE BAR STATUS (Mimics Apple watch/phone sync bars) */}
      <div id="device-status-header" className="max-w-4xl mx-auto px-4 md:px-6 pt-3 pb-2 flex items-center justify-between border-b border-[#313131] text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <Activity className="w-4.5 h-4.5 text-move-pink animate-pulse" />
          <span className="font-semibold text-zinc-400"> Fitness ActiveLink</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#a4ff00]" />
          <span className="hidden sm:inline-block text-zinc-600">Sensor Online</span>
        </div>
        
        {/* Real-time ticking system clock */}
        <div className="font-bold text-zinc-350 flex items-center gap-2">
          <span>{systemTime || '10:00:00 AM'}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-zinc-650" />
            <Smartphone className="w-3.5 h-3.5 text-zinc-650" />
          </div>
          <span className="text-zinc-500 font-bold hidden xs:inline">100% Sync</span>
          <Battery className="w-4.5 h-4.5 text-[#a4ff00] fill-[#a4ff00]/20" />
        </div>
      </div>

      {/* 2. APP CENTRAL VIEW PORTION */}
      <main id="app-content-viewport" className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-12 space-y-8">
        
        {/* DASHBOARD TOP BRAND ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8e8e93] font-mono">
              Biometric Overview
            </span>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-white mt-1 flex items-center gap-2">
              <span>{currentTab === 'Summary' ? 'Summary' : currentTab === 'Fitness' ? 'Fitness+' : currentTab === 'Sharing' ? 'Sharing' : 'Profile Settings'}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-move-pink inline-block shadow-[0_0_8px_#ff2d55]" />
            </h1>
          </div>

          {/* Quick achievement banner */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1c1c1e] border border-[#313131] max-w-sm">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
              <Award className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#8e8e93] uppercase font-bold">Today's Streak</span>
              <p className="text-xs font-semibold text-white leading-relaxed">Closing all rings (9 streak days)</p>
            </div>
          </div>
        </div>

        {/* 3. CONDITIONAL TAB SWAPPERS */}
        <div>
          {currentTab === 'Summary' && (
            <div id="tab-summary-content" className="space-y-8">
              
              {/* SECTION 1: CONCENTRIC ACTIVITY RINGS PORTRAIT */}
              <ActivityRings 
                activity={activity}
                targets={targets}
              />

              {/* SECTION 2: HORIZONTAL METRICS CARDS */}
              <SummaryCards 
                metrics={computedMetrics}
                onMetricClick={(metric) => setSelectedMetric(metric)}
              />

              {/* SECTION 3: WORKOUTS HISTORY (BELOW SUMMARY) */}
              <WorkoutsSection 
                workouts={workouts}
                onAddWorkout={handleAddWorkout}
              />

            </div>
          )}

          {currentTab === 'Fitness' && (
            <div id="tab-fitness-content">
              <FitnessTab 
                onAutoAddWorkout={(workoutDetail) => {
                  const now = new Date();
                  const timestampStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  handleAddWorkout({
                    ...workoutDetail,
                    date: timestampStr
                  });
                }}
              />
            </div>
          )}

          {currentTab === 'Sharing' && (
            <div id="tab-sharing-content">
              <SharingTab />
            </div>
          )}

          {currentTab === 'Profile' && (
            <div id="tab-profile-content">
              <ProfileTab 
                targets={targets}
                onUpdateTargets={(newTargets) => setTargets(newTargets)}
              />
            </div>
          )}
        </div>

      </main>

      {/* 4. EXPANDABLE DETAIL OVERLAY POPUP */}
      <AnimatePresence>
        {selectedMetric && (
          <div key={selectedMetric.id}>
            <MetricDetailModal 
              metric={selectedMetric}
              onClose={() => setSelectedMetric(null)}
              onLogData={handleLogData}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING GLASS BAR TAB NAVIGATION */}
      <nav 
        id="floating-nav-bar" 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#1c1c1e]/80 backdrop-blur-md border border-[#313131] py-2.5 px-4 rounded-full flex items-center justify-between gap-5 shadow-2xl w-11/12 max-w-sm"
      >
        {/* TAB 1: SUMMARY */}
        <button
          onClick={() => setCurrentTab('Summary')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2.5 rounded-2xl transition hover:text-white ${
            currentTab === 'Summary' ? 'text-move-pink bg-black/40 border border-[#313131]/60' : 'text-[#8e8e93]'
          }`}
          title="Summary Metrics"
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-tight">Summary</span>
        </button>

        {/* TAB 2: FITNESS+ */}
        <button
          onClick={() => setCurrentTab('Fitness')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2.5 rounded-2xl transition hover:text-white ${
            currentTab === 'Fitness' ? 'text-exercise-green bg-black/40 border border-[#313131]/60' : 'text-[#8e8e93]'
          }`}
          title="Fitness+ Streaming"
        >
          <PlayCircle className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-tight">Fitness+</span>
        </button>

        {/* TAB 3: SHARING */}
        <button
          onClick={() => setCurrentTab('Sharing')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2.5 rounded-2xl transition hover:text-white ${
            currentTab === 'Sharing' ? 'text-stand-blue bg-black/40 border border-[#313131]/60' : 'text-[#8e8e93]'
          }`}
          title="Sharing Feed"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-tight">Sharing</span>
        </button>

        {/* TAB 4: PROFILE */}
        <button
          onClick={() => setCurrentTab('Profile')}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 px-2.5 rounded-2xl transition hover:text-white ${
            currentTab === 'Profile' ? 'text-purple-400 bg-black/40 border border-[#313131]/60' : 'text-[#8e8e93]'
          }`}
          title="Profile and Goals"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-mono font-bold tracking-tight">Profile</span>
        </button>
      </nav>

    </div>
  );
}
