import React, { useState, useEffect } from 'react';
import { FitnessVideo, WorkoutType, Workout } from '../types';
import { INITIAL_VIDEOS } from '../data';
import { Play, Flame, Trophy, PlayCircle, Pause, Sparkles, Filter, ChevronRight, CheckCircle2, Rewind, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FitnessTabProps {
  onAutoAddWorkout: (workout: Omit<Workout, 'id' | 'date'>) => void;
}

export default function FitnessTab(props: FitnessTabProps) {
  const { onAutoAddWorkout } = props;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeVideo, setActiveVideo] = useState<FitnessVideo | null>(null);
  
  // Video Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [secsRemaining, setSecsRemaining] = useState(0);
  const [sessionCals, setSessionCals] = useState(0);
  const [liveHr, setLiveHr] = useState(110);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const categories = ['All', 'HIIT', 'Yoga', 'Cycling', 'Strength', 'Mindfulness'];

  const filteredVideos = selectedCategory === 'All' 
    ? INITIAL_VIDEOS
    : INITIAL_VIDEOS.filter(v => v.category === selectedCategory);

  const startWorkoutVideo = (video: FitnessVideo) => {
    setActiveVideo(video);
    setSecsRemaining(video.duration * 60); // actual minutes in seconds
    setSessionCals(0);
    setLiveHr(115);
    setIsPlaying(true);
    setWorkoutComplete(false);
  };

  // Live fitness tracker simulator timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && activeVideo && secsRemaining > 0) {
      interval = setInterval(() => {
        setSecsRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setWorkoutComplete(true);
            return 0;
          }
          return prev - 12; // Simulate double speed for preview
        });

        // Tick calories burned up
        setSessionCals(prev => {
          const calBurnRate = activeVideo.category === 'HIIT' ? 0.35 : activeVideo.category === 'Yoga' ? 0.12 : 0.24;
          return Math.round(prev + calBurnRate * 12);
        });

        // Fluctuating Heart rate
        setLiveHr(prev => {
          const change = Math.round((Math.random() - 0.48) * 6);
          const base = activeVideo.category === 'HIIT' ? 160 : activeVideo.category === 'Mindfulness' ? 75 : 130;
          const target = prev + change;
          return Math.max(Math.min(target, base + 15), base - 15);
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeVideo, secsRemaining]);

  const saveCompletedWorkout = () => {
    if (!activeVideo) return;
    onAutoAddWorkout({
      type: activeVideo.category === 'Mindfulness' ? 'Yoga' : (activeVideo.category as any),
      durationMinutes: activeVideo.duration,
      caloriesBurned: sessionCals,
      heartRateAverage: liveHr,
      notes: `Completed Fitness+ trainer-led course "${activeVideo.title}" coached by ${activeVideo.trainer}.`,
    });
    setActiveVideo(null);
    setWorkoutComplete(false);
  };

  const formatTimer = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="fitness-tab-container" className="space-y-6">
      
      {/* HEADER HERO */}
      <div 
        id="fitness-hero-card" 
        className="relative bg-zinc-950 rounded-3xl border border-zinc-900 overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="space-y-3 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider font-mono">
            <Sparkles className="w-3 h-3 text-green-300" />
            <span>Apple Fitness+ Studio</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white">
            Train with elite coaches. Anywhere. Anytime.
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Experience cataloged workouts streaming virtual paces on your own schedules. Filter categories, press play, and we will sync calories and timing straight to your Move ring targets.
          </p>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=300" 
          alt="Athlete" 
          className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-2xl border border-zinc-800 flex-shrink-0 relative shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* FILTER BUTTONS */}
      <div id="fitness-categories" className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              selectedCategory === cat
                ? 'bg-white border-white text-black font-bold'
                : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIDEOS GRID */}
      <div id="fitness-videos-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -4 }}
            className="group bg-[#1c1c1e] rounded-2xl border border-[#313131] overflow-hidden flex flex-col hover:border-zinc-700 transition-colors"
          >
            {/* THUMBNAIL */}
            <div className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-[#313131]">
              <img 
                src={video.imageUrl} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              
              <button 
                onClick={() => startWorkoutVideo(video)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity"
              >
                <div className="p-3 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 fill-black" />
                  <span className="text-xs">Start workout</span>
                </div>
              </button>

              {/* TIMING CHIPS */}
              <span className="absolute bottom-3 left-3 text-[10px] bg-black/80 px-2 py-0.5 rounded-md font-mono font-bold text-[#8e8e93] border border-[#313131]">
                {video.duration} MIN
              </span>
              <span className="absolute bottom-3 right-3 text-[10px] bg-black/80 px-2 py-0.5 rounded-md font-mono font-bold text-[#8e8e93] border border-[#313131]">
                {video.difficulty}
              </span>
            </div>

            {/* CARD META */}
            <div className="p-4 flex-grow flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-exercise-green font-mono">
                  {video.category}
                </span>
                <h3 className="font-semibold text-sm text-white mt-1 group-hover:text-exercise-green transition-colors leading-snug">
                  {video.title}
                </h3>
              </div>
              
              <div className="flex items-center justify-between border-t border-[#313131] pt-2 text-xs text-zinc-500">
                <span>Trainer: {video.trainer}</span>
                <button 
                  onClick={() => startWorkoutVideo(video)}
                  className="text-white hover:text-exercise-green p-1 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                >
                  <span>Train</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ACTIVE VIDEO FULL-SCREEN SIMULATED PLAYER OVERLAY */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6"
          >
            {/* TOP BAR */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d55] animate-ping" />
                <span className="text-xs text-zinc-400 font-mono tracking-wider uppercase">Live Activity Syncing with Watch</span>
              </div>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveVideo(null);
                }}
                className="px-4 py-1.5 rounded-full bg-black/40 border border-[#313131] text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Exit Session
              </button>
            </div>

            {/* CENTRAL WORKOUT TELEMETRY HUD */}
            <div className="max-w-xl mx-auto w-full text-center space-y-8">
              
              <div className="space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-black/60 text-exercise-green font-mono uppercase text-xs tracking-wider border border-[#313131]">
                  {activeVideo.category} with {activeVideo.trainer}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold font-display text-white mt-2 leading-tight">
                  {activeVideo.title}
                </h1>
              </div>

              {/* TIMING TIMER LARGE COUNTER */}
              <div className="relative py-12 rounded-3xl bg-black/40 border border-[#313131] max-w-sm mx-auto shadow-2xl flex flex-col items-center justify-center">
                
                {/* Simulated circular border ticking */}
                <div className="absolute inset-4 border-2 border-dashed border-exercise-green/10 rounded-full animate-[spin_100s_linear_infinite]" />

                <span className="text-6xl font-extrabold font-display text-white tracking-widest font-mono">
                  {formatTimer(secsRemaining)}
                </span>
                <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-2">
                  Remaining Countdown
                </p>
                <p className="text-zinc-650 text-[9px] font-mono mt-1">
                  (Simulated rapid preview: counts down 12s per tick)
                </p>
              </div>

              {/* METRICS METERS SPLITS */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* CALS BURNED */}
                <div className="bg-black/30 border border-[#313131] p-4.5 rounded-2xl flex flex-col items-center">
                  <Flame className="w-5 h-5 text-move-pink mb-1 animate-bounce" />
                  <span className="text-2xl font-bold font-display text-white">{sessionCals}</span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">KCAL burned</span>
                </div>

                {/* HEART RATE */}
                <div className="bg-black/30 border border-[#313131] p-4.5 rounded-2xl flex flex-col items-center">
                  <Heart className="w-5 h-5 text-[#ff2d55] mb-1 animate-pulse" />
                  <span className="text-2xl font-bold font-display text-white">{liveHr}</span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">bpm live rate</span>
                </div>

                {/* PACING ENERGY */}
                <div className="col-span-2 md:col-span-1 bg-black/30 border border-[#313131] p-4.5 rounded-2xl flex flex-col items-center">
                  <Trophy className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-2xl font-bold font-display text-white">
                    {Math.round((activeVideo.duration * 60 - secsRemaining) / (activeVideo.duration * 60) * 100)}%
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">completed</span>
                </div>
              </div>

              {/* SAVED NOTIFIER FOR COMPLETE */}
              {workoutComplete && (
                <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-400">Workout Session Successfully Completed!</span>
                  </div>
                  <button
                    onClick={saveCompletedWorkout}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold text-xs rounded-full transition-all tracking-wide"
                  >
                    Post workout to metrics
                  </button>
                </div>
              )}

            </div>

            {/* PLAYER CONTROL BAR */}
            <div className="max-w-md mx-auto w-full flex justify-center items-center gap-6 pb-6">
              <button 
                onClick={() => setSecsRemaining(prev => Math.min(prev + 60, activeVideo.duration * 60))}
                className="p-3 bg-black hover:bg-zinc-900 rounded-full border border-[#313131] text-white transition-colors"
                title="Rewind 1 min"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-4 rounded-full ${isPlaying ? 'bg-white text-black' : 'bg-exercise-green text-black'} transition-all`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black" />}
              </button>

              <button
                onClick={() => setSecsRemaining(0)}
                className="p-3 bg-black hover:bg-zinc-950 rounded-full border border-[#313131] text-zinc-400 hover:text-white transition-colors text-xs font-mono uppercase"
              >
                Skip to end
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
