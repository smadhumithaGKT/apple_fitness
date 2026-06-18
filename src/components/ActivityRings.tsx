import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityState, DailyTargets } from '../types';
import { Zap, Timer, ArrowUp } from 'lucide-react';

interface ActivityRingsProps {
  activity: ActivityState;
  targets: DailyTargets;
}

export default function ActivityRings(props: ActivityRingsProps) {
  const { activity, targets } = props;
  const [hoveredRing, setHoveredRing] = useState<'move' | 'exercise' | 'stand' | null>(null);

  // Targets and Current Values
  const movePct = activity.moveCurrent / targets.moveGoal;
  const exercisePct = activity.exerciseCurrent / targets.exerciseGoal;
  const standPct = activity.standCurrent / targets.standGoal;

  // Radii and Circumferences for Concentric Circles
  const outerRadius = 94;
  const outerCirc = 2 * Math.PI * outerRadius;

  const middleRadius = 74;
  const middleCirc = 2 * Math.PI * middleRadius;

  const innerRadius = 54;
  const innerCirc = 2 * Math.PI * innerRadius;

  // Calculators for strokeDashoffset (Ensure we don't go negative or clip awkwardly)
  // Clamp at max 1 for the ring wrap, but display the actual text beyond 100%
  const calcDashoffset = (pct: number, circ: number) => {
    const clampedPct = Math.min(Math.max(pct, 0), 0.999);
    return circ - clampedPct * circ;
  };

  return (
    <div id="activity-rings-container" className="flex flex-col md:flex-row items-center gap-8 bg-[#1c1c1e] p-6 rounded-3xl border border-[#313131] shadow-2xl relative overflow-hidden">
      
      {/* Background radial soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] bg-[#ff2d55]/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-[60px] bg-[#a4ff00]/5 pointer-events-none" />

      {/* SVG Canvas Area */}
      <div className="relative w-[220px] h-[220px] select-none flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
          <defs>
            {/* Gradients for rings */}
            <linearGradient id="moveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2d55" />
              <stop offset="100%" stopColor="#ff5e3a" />
            </linearGradient>
            <linearGradient id="exerciseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a4ff00" />
              <stop offset="100%" stopColor="#80ff00" />
            </linearGradient>
            <linearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#0072ff" />
            </linearGradient>
            
            {/* Filters for glowing shadows */}
            <filter id="shadow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. MOVE (OUTER RING) - Pink */}
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={outerRadius}
            stroke="#ff2d55"
            strokeWidth="16"
            fill="transparent"
            className="opacity-15 cursor-pointer transition-all duration-300"
            onClick={() => setHoveredRing('move')}
            onMouseEnter={() => setHoveredRing('move')}
            onMouseLeave={() => setHoveredRing(null)}
          />
          {/* Active Path */}
          <motion.circle
            cx="110"
            cy="110"
            r={outerRadius}
            stroke="url(#moveGradient)"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={outerCirc}
            initial={{ strokeDashoffset: outerCirc }}
            animate={{ 
              strokeDashoffset: calcDashoffset(movePct, outerCirc),
              strokeWidth: hoveredRing === 'move' ? 18 : 16 
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 60 }}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 drop-shadow-[0_0_2px_rgba(255,45,85,0.3)]"
            onMouseEnter={() => setHoveredRing('move')}
            onMouseLeave={() => setHoveredRing(null)}
          />

          {/* 2. EXERCISE (MIDDLE RING) - Green */}
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={middleRadius}
            stroke="#a4ff00"
            strokeWidth="16"
            fill="transparent"
            className="opacity-15 cursor-pointer transition-all duration-300"
            onClick={() => setHoveredRing('exercise')}
            onMouseEnter={() => setHoveredRing('exercise')}
            onMouseLeave={() => setHoveredRing(null)}
          />
          {/* Active Path */}
          <motion.circle
            cx="110"
            cy="110"
            r={middleRadius}
            stroke="url(#exerciseGradient)"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={middleCirc}
            initial={{ strokeDashoffset: middleCirc }}
            animate={{ 
              strokeDashoffset: calcDashoffset(exercisePct, middleCirc),
              strokeWidth: hoveredRing === 'exercise' ? 18 : 16
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 60, delay: 0.1 }}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 drop-shadow-[0_0_2px_rgba(164,255,0,0.3)]"
            onMouseEnter={() => setHoveredRing('exercise')}
            onMouseLeave={() => setHoveredRing(null)}
          />

          {/* 3. STAND (INNER RING) - Cyan */}
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={innerRadius}
            stroke="#00f0ff"
            strokeWidth="16"
            fill="transparent"
            className="opacity-15 cursor-pointer transition-all duration-300"
            onClick={() => setHoveredRing('stand')}
            onMouseEnter={() => setHoveredRing('stand')}
            onMouseLeave={() => setHoveredRing(null)}
          />
          {/* Active Path */}
          <motion.circle
            cx="110"
            cy="110"
            r={innerRadius}
            stroke="url(#standGradient)"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={innerCirc}
            initial={{ strokeDashoffset: innerCirc }}
            animate={{ 
              strokeDashoffset: calcDashoffset(standPct, innerCirc),
              strokeWidth: hoveredRing === 'stand' ? 18 : 16
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 60, delay: 0.2 }}
            strokeLinecap="round"
            className="cursor-pointer transition-all duration-300 drop-shadow-[0_0_2px_rgba(0,240,255,0.3)]"
            onMouseEnter={() => setHoveredRing('stand')}
            onMouseLeave={() => setHoveredRing(null)}
          />
        </svg>

        {/* Center icon / status based on hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <AnimatePresence mode="wait">
            {!hoveredRing ? (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <span className="font-display font-bold text-2xl text-zinc-100">
                  {Math.round((movePct + exercisePct + standPct) / 3 * 100)}%
                </span>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Today</p>
              </motion.div>
            ) : hoveredRing === 'move' ? (
              <motion.div
                key="move"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center flex flex-col items-center"
              >
                <Zap className="w-5 h-5 text-move-pink mb-0.5 animate-pulse" />
                <span className="font-display font-semibold text-lg text-move-pink">
                  {Math.round(movePct * 100)}%
                </span>
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Move</span>
              </motion.div>
            ) : hoveredRing === 'exercise' ? (
              <motion.div
                key="exercise"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center flex flex-col items-center"
              >
                <Timer className="w-5 h-5 text-exercise-green mb-0.5 animate-pulse" />
                <span className="font-display font-semibold text-lg text-exercise-green">
                  {Math.round(exercisePct * 100)}%
                </span>
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Exercise</span>
              </motion.div>
            ) : (
              <motion.div
                key="stand"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center flex flex-col items-center"
              >
                <ArrowUp className="w-5 h-5 text-stand-blue mb-0.5 animate-pulse" />
                <span className="font-display font-semibold text-lg text-stand-blue">
                  {Math.round(standPct * 100)}%
                </span>
                <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider">Stand</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Numerical readouts */}
      <div id="activity-readouts-col" className="flex flex-col gap-4 flex-grow w-full">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-mono mb-1">
          Activity Activity
        </h3>

        {/* MOVE Card */}
        <div 
          id="move-readout"
          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
            hoveredRing === 'move' ? 'bg-move-pink-bg border border-move-pink/30' : 'bg-black/40 border border-[#313131] hover:bg-[#1c1c1e]'
          }`}
          onMouseEnter={() => setHoveredRing('move')}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-move-pink shadow-[0_0_8px_#ff2d55]" />
            <div>
              <span className="text-zinc-400 font-medium text-sm">Move</span>
              <div className="text-[11px] text-zinc-500 font-mono">Active Energy</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold font-display text-white">
              {activity.moveCurrent} <span className="text-xs text-zinc-500 font-medium font-sans">/ {targets.moveGoal} KCAL</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 font-semibold">{Math.round(movePct * 100)}% complete</div>
          </div>
        </div>

        {/* EXERCISE Card */}
        <div 
          id="exercise-readout"
          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
            hoveredRing === 'exercise' ? 'bg-exercise-green-bg border border-exercise-green/30' : 'bg-black/40 border border-[#313131] hover:bg-[#1c1c1e]'
          }`}
          onMouseEnter={() => setHoveredRing('exercise')}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-exercise-green shadow-[0_0_8px_#a4ff00]" />
            <div>
              <span className="text-zinc-400 font-medium text-sm">Exercise</span>
              <div className="text-[11px] text-zinc-500 font-mono">Total Activity</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold font-display text-white">
              {activity.exerciseCurrent} <span className="text-xs text-zinc-500 font-medium font-sans">/ {targets.exerciseGoal} MIN</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 font-semibold">{Math.round(exercisePct * 100)}% complete</div>
          </div>
        </div>

        {/* STAND Card */}
        <div 
          id="stand-readout"
          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
            hoveredRing === 'stand' ? 'bg-stand-blue-bg border border-stand-blue/30' : 'bg-black/40 border border-[#313131] hover:bg-[#1c1c1e]'
          }`}
          onMouseEnter={() => setHoveredRing('stand')}
          onMouseLeave={() => setHoveredRing(null)}
        >
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-stand-blue shadow-[0_0_8px_#00f0ff]" />
            <div>
              <span className="text-zinc-400 font-medium text-sm">Stand</span>
              <div className="text-[11px] text-zinc-500 font-mono">Idle Break Mins</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold font-display text-white">
              {activity.standCurrent} <span className="text-xs text-zinc-500 font-medium font-sans">/ {targets.standGoal} HRS</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400 font-semibold">{Math.round(standPct * 100)}% complete</div>
          </div>
        </div>

      </div>
    </div>
  );
}
