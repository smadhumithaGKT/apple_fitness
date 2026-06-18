import React, { useState } from 'react';
import { Workout, WorkoutType } from '../types';
import { Dumbbell, Bike, Flame, Footprints, Activity, Sparkles, Waves, Plus, Calendar, Clock, Heart, Zap, ChevronDown, ChevronUp, MapPin, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkoutsSectionProps {
  workouts: Workout[];
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
}

export default function WorkoutsSection(props: WorkoutsSectionProps) {
  const { workouts, onAddWorkout } = props;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState<WorkoutType>('Running');
  const [duration, setDuration] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('120');
  const [distance, setDistance] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(duration);
    const caloriesNum = parseInt(calories);
    const hrNum = parseInt(heartRate);
    const distNum = distance ? parseFloat(distance) : undefined;

    if (isNaN(durationNum) || durationNum <= 0) return;
    if (isNaN(caloriesNum) || caloriesNum < 0) return;

    // Format relative timestamp
    const now = new Date();
    const timestampStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    onAddWorkout({
      type,
      date: timestampStr,
      durationMinutes: durationNum,
      caloriesBurned: caloriesNum,
      heartRateAverage: hrNum,
      distanceKm: distNum,
      notes: notes.trim() || undefined,
    });

    // Reset Form
    setDuration('');
    setCalories('');
    setHeartRate('120');
    setDistance('');
    setNotes('');
    setIsFormOpen(false);
  };

  const getWorkoutIcon = (workoutType: WorkoutType, className = 'w-5 h-5') => {
    switch (workoutType) {
      case 'Running':
        return <Activity className={`${className} text-move-pink`} />;
      case 'Cycling':
        return <Bike className={`${className} text-emerald-400`} />;
      case 'HIIT':
        return <Flame className={`${className} text-orange-500`} />;
      case 'Yoga':
        return <Sparkles className={`${className} text-purple-400`} />;
      case 'Strength':
        return <Dumbbell className={`${className} text-amber-500`} />;
      case 'Swimming':
        return <Waves className={`${className} text-stand-blue`} />;
      case 'Walking':
        return <Footprints className={`${className} text-zinc-400`} />;
      default:
        return <Activity className={`${className} text-white`} />;
    }
  };

  const getWorkoutColorClass = (workoutType: WorkoutType) => {
    switch (workoutType) {
      case 'Running': return 'bg-red-500/10 border-red-500/25 text-red-400';
      case 'Cycling': return 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400';
      case 'HIIT': return 'bg-orange-500/10 border-orange-500/25 text-orange-400';
      case 'Yoga': return 'bg-purple-500/10 border-purple-500/25 text-purple-400';
      case 'Strength': return 'bg-amber-500/10 border-amber-500/25 text-amber-400';
      case 'Swimming': return 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400';
      default: return 'bg-zinc-500/10 border-zinc-500/25 text-zinc-400';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedWorkoutId(expandedWorkoutId === id ? null : id);
  };

  return (
    <div id="workouts-section-root" className="flex flex-col gap-4">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div id="workouts-count-badge" className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-mono">
            Workouts & Sports History
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-[#313131] text-zinc-400 font-mono">
            {workouts.length} recorded
          </span>
        </div>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#313131] text-xs font-semibold text-white transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* DYNAMIC LOG WORKOUT CONTAINER */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden bg-[#1c1c1e] border border-[#313131] p-5 rounded-3xl space-y-4 shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
              <Plus className="w-4 h-4 text-zinc-550" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                Log New Training Session
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              
              {/* Type select */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as WorkoutType)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition"
                >
                  <option value="Running">🏃 Running</option>
                  <option value="Cycling">🚴 Cycling</option>
                  <option value="HIIT">🔥 HIIT Workout</option>
                  <option value="Yoga">🧘 Yoga</option>
                  <option value="Strength">🏋️ Strength</option>
                  <option value="Swimming">🏊 Swimming</option>
                  <option value="Walking">🚶 Walking</option>
                </select>
              </div>

              {/* Duration input */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Duration (min)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition placeholder:text-zinc-800"
                />
              </div>

              {/* Calories burned input */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Active Energy (Cal)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 250"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition placeholder:text-zinc-800"
                />
              </div>

              {/* Heart Rate average */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Heart Rate (avg bpm)</label>
                <input
                  type="number"
                  required
                  min="40"
                  max="220"
                  placeholder="e.g. 140"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition placeholder:text-zinc-800"
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Optional Distance */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Distance (optional km)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5.5"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition placeholder:text-zinc-800"
                />
              </div>

              {/* Optional Notes */}
              <div className="flex flex-col gap-1.5Col">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold font-mono">Session Notes</label>
                <input
                  type="text"
                  placeholder="How did you feel?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-black border border-[#313131] outline-none text-xs text-white p-2.5 rounded-xl focus:border-zinc-500 transition placeholder:text-zinc-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#313131]">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-black hover:bg-zinc-900 border border-[#313131] text-[#8e8e93] hover:text-white font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl transition shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              >
                Save Workout
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* WORKOUTS LIST */}
      <div id="workouts-scroll-container" className="flex flex-col gap-2.5">
        {workouts.map((workout) => {
          const isExpanded = expandedWorkoutId === workout.id;

          return (
            <div
              key={workout.id}
              id={`workout-item-${workout.id}`}
              className="bg-[#1c1c1e] p-4 rounded-2xl border border-[#313131] hover:border-zinc-700 transition-all duration-300"
            >
              {/* PRIMARY CARD HEADER ROW */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(workout.id)}
              >
                <div className="flex items-center gap-4.5">
                  <div className="p-3 rounded-xl bg-black/40 border border-[#313131]">
                    {getWorkoutIcon(workout.type, 'w-5.5 h-5.5')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                      {workout.type === 'HIIT' ? 'HIIT Workout' : `${workout.type} Session`}
                      {workout.notes && (
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-650" />
                      )}
                    </h4>
                    <span className="text-[11px] font-mono text-[#8e8e93] flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3 text-zinc-600" />
                      {workout.date}
                    </span>
                  </div>
                </div>

                {/* BASIC ROW STATS */}
                <div className="flex items-center gap-6 md:gap-10">
                  <div className="text-right flex flex-col md:inline-flex md:flex-row md:items-baseline md:gap-1.5">
                    <span className="text-sm font-bold font-display text-white">{workout.durationMinutes}</span>
                    <span className="text-[10px] text-[#8e8e93] font-mono uppercase">min</span>
                  </div>

                  <div className="text-right flex flex-col md:inline-flex md:flex-row md:items-baseline md:gap-1.5">
                    <span className="text-sm font-bold font-display text-move-pink">{workout.caloriesBurned}</span>
                    <span className="text-[10px] text-[#8e8e93] font-mono uppercase">kcal</span>
                  </div>

                  {workout.distanceKm !== undefined && (
                    <div className="text-right hidden sm:flex flex-col md:inline-flex md:flex-row md:items-baseline md:gap-1.5">
                      <span className="text-sm font-bold font-display text-stand-blue">{workout.distanceKm}</span>
                      <span className="text-[10px] text-[#8e8e93] font-mono uppercase">km</span>
                    </div>
                  )}

                  <div className="text-[#8e8e93] group-hover:text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* DETAILED EXPANSION CONTENT */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden border-t border-[#313131] pt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      
                      {/* STAT 1: HR DETAILS */}
                      <div className="bg-black/30 border border-[#313131] p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-[#8e8e93] font-mono uppercase text-[9px] font-bold">
                          <Heart className="w-3.5 h-3.5 text-move-pink" />
                          <span>Heart Rate Analyzer</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold font-display text-white">
                            {workout.heartRateAverage}
                          </span>
                          <span className="text-[10px] text-[#8e8e93]">avg bpm</span>
                        </div>
                        <p className="text-[10px] text-[#8e8e93] leading-relaxed font-mono">
                          Intensity Zone: {workout.heartRateAverage > 140 ? 'Zone 4 Aerobic' : 'Zone 2 Fat Burn'}
                        </p>
                      </div>

                      {/* STAT 2: SPLITS & DISTANCE */}
                      <div className="bg-black/30 border border-[#313131] p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-[#8e8e93] font-mono uppercase text-[9px] font-bold">
                          <Zap className="w-3.5 h-3.5 text-exercise-green" />
                          <span>Efficiency & Pace</span>
                        </div>
                        {workout.distanceKm !== undefined ? (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold font-display text-white">
                                {((workout.durationMinutes) / workout.distanceKm).toFixed(2)}
                              </span>
                              <span className="text-[10px] text-zinc-400">min/km pace</span>
                            </div>
                            <span className="text-[10px] text-zinc-650 font-mono">Dynamic route telemetry synced</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold font-display text-white">
                                {(workout.caloriesBurned / workout.durationMinutes).toFixed(1)}
                              </span>
                              <span className="text-[10px] text-zinc-400">kcal/min density</span>
                            </div>
                            <span className="text-[10px] text-[#8e8e93] font-mono">Non-aerobic isometric focus</span>
                          </div>
                        )}
                      </div>

                      {/* STAT 3: PERSONAL NOTES */}
                      <div className="bg-black/30 border border-[#313131] p-3.5 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-[#8e8e93] font-mono uppercase text-[9px] font-bold">
                          <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
                          <span>Trainer & Mind Notes</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-[10px] italic">
                          "{workout.notes || 'No workout notes recorded. Write notes during creation to add session insights.'}"
                        </p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

    </div>
  );
}
