import React, { useState } from 'react';
import { DailyTargets } from '../types';
import { Settings, Shield, Edit2, Save, Award, User, Target, Circle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileTabProps {
  targets: DailyTargets;
  onUpdateTargets: (newTargets: DailyTargets) => void;
}

export interface UserBio {
  name: string;
  age: number;
  weightLbs: number;
  heightInches: number;
  wheelchair: boolean;
}

export default function ProfileTab(props: ProfileTabProps) {
  const { targets, onUpdateTargets } = props;

  // Bio state
  const [bio, setBio] = useState<UserBio>({
    name: 'Alex Rivera',
    age: 28,
    weightLbs: 165,
    heightInches: 70,
    wheelchair: false,
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState<UserBio>({ ...bio });

  // Targets state
  const [moveGoal, setMoveGoal] = useState<string>(String(targets.moveGoal));
  const [exerciseGoal, setExerciseGoal] = useState<string>(String(targets.exerciseGoal));
  const [standGoal, setStandGoal] = useState<string>(String(targets.standGoal));

  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const move = parseInt(moveGoal);
    const exercise = parseInt(exerciseGoal);
    const stand = parseInt(standGoal);

    if (isNaN(move) || move <= 0) return;
    if (isNaN(exercise) || exercise <= 0) return;
    if (isNaN(stand) || stand <= 0 || stand > 24) return;

    onUpdateTargets({
      moveGoal: move,
      exerciseGoal: exercise,
      standGoal: stand,
    });

    setSuccessMsg('Goals updated! Activity rings recalculated.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setBio({ ...editedBio });
    setIsEditingBio(false);
    setSuccessMsg('Bio and physical specifications customized.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Static awards representations
  const awards = [
    { id: 'a-1', name: 'First Workout', desc: 'Rewarded on your first log', color: '#ff1256', date: 'Closed May 12' },
    { id: 'a-2', name: 'Perfect Week', desc: 'Closed all rings 7 days straight', color: '#00ff3c', date: 'Closed Jun 02' },
    { id: 'a-3', name: 'Move 200%', desc: 'Earned 2x calorie metrics in single cap', color: '#00f0ff', date: 'Closed Jun 15' },
    { id: 'a-4', name: 'Earth Day Challenge', desc: 'Recorded indoor swim session', color: '#a855f7', date: 'Closed Apr 22' },
    { id: 'a-5', name: '100 Workouts', desc: 'Completed milestone logs', color: '#eab308', date: 'Locked - 96/100' },
  ];

  return (
    <div id="profile-tab-root" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: BIO & SPECS */}
      <div className="md:col-span-1 space-y-6">
        
        <div className="bg-[#1c1c1e] rounded-3xl border border-[#313131] overflow-hidden">
          {/* Cover Header */}
          <div className="h-24 bg-gradient-to-r from-move-pink/15 via-exercise-green/10 to-stand-blue/15 relative" />
          
          <div className="px-6 pb-6 relative text-center -mt-10">
            {/* Avatar Circle */}
            <div className="w-20 h-20 bg-black/40 border-4 border-[#313131] rounded-full mx-auto flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-zinc-400" />
            </div>

            <h2 className="text-lg font-bold text-white mt-3 font-display">{bio.name}</h2>
            <p className="text-[11px] text-[#8e8e93] font-mono uppercase tracking-wider mt-0.5">Apple Watch Health Node</p>

            <div className="grid grid-cols-3 gap-2 border-t border-[#313131] pt-5 mt-5">
              <div className="text-center">
                <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Age</span>
                <p className="text-sm font-bold text-white mt-0.5">{bio.age} yrs</p>
              </div>
              <div className="text-center">
                <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Weight</span>
                <p className="text-sm font-bold text-white mt-0.5">{bio.weightLbs} lbs</p>
              </div>
              <div className="text-center">
                <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Height</span>
                <p className="text-sm font-bold text-white mt-0.5">{bio.heightInches}"</p>
              </div>
            </div>

            {/* Quick edit bio info */}
            {!isEditingBio ? (
              <button
                onClick={() => {
                  setEditedBio({ ...bio });
                  setIsEditingBio(true);
                }}
                className="w-full mt-6 py-2 bg-[#1c1c1e] hover:bg-zinc-900 border border-[#313131] text-[#8e8e93] hover:text-white rounded-xl text-xs font-semibold transition"
              >
                Edit Physical Specs
              </button>
            ) : (
              <form onSubmit={handleSaveBio} className="space-y-3.5 text-left mt-5 pt-4 border-t border-[#313131]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editedBio.name}
                    onChange={(e) => setEditedBio(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-black border border-[#313131] outline-none text-xs text-white p-2 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Age</label>
                    <input
                      type="number"
                      required
                      value={editedBio.age}
                      onChange={(e) => setEditedBio(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="bg-black border border-[#313131] outline-none text-xs text-white p-2 rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono font-bold">Weight (lbs)</label>
                    <input
                      type="number"
                      required
                      value={editedBio.weightLbs}
                      onChange={(e) => setEditedBio(prev => ({ ...prev, weightLbs: parseInt(e.target.value) || 0 }))}
                      className="bg-black border border-[#313131] outline-none text-xs text-white p-2 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="w-1/2 py-2 bg-black hover:bg-zinc-900 text-[#8e8e93] border border-[#313131] rounded-xl text-xs font-semibold hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 bg-white text-black font-bold rounded-xl text-xs hover:bg-zinc-200 transition"
                  >
                    Save Specs
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* SECURE METADATA */}
        <div className="bg-[#1c1c1e] p-4.5 rounded-3xl border border-[#313131] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-400 font-mono uppercase text-[9px] font-bold">
            <Shield className="w-3.5 h-3.5 text-[#8e8e93]" />
            <span>Health Privacy & Key</span>
          </div>
          <p className="text-[11px] text-[#8e8e93] leading-relaxed font-sans">
            Apple Dashboard encrypts logs locally on your browser. Your biometric details are never cataloged or exposed to third parties.
          </p>
        </div>

      </div>

      {/* MID COLUMN: EDIT TARGETS / DAILY GOALS */}
      <div className="md:col-span-2 space-y-6">
        
        {/* SUCCESS ALERTER */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-xs"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[#1c1c1e] rounded-3xl border border-[#313131] p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[#313131] pb-3">
            <Target className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Customize Daily Targets & Thresholds
            </h3>
          </div>

          <form onSubmit={handleSaveTargets} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* MOVE TARGET */}
              <div className="bg-black/20 border border-[#313131] p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Move Goal</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-move-pink shadow-[0_0_6px_#ff2d55]" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="3000"
                    required
                    value={moveGoal}
                    onChange={(e) => setMoveGoal(e.target.value)}
                    className="w-full bg-black border border-[#313131] focus:border-zinc-500 outline-none text-base font-bold font-display text-white p-2.5 rounded-xl placeholder:text-zinc-700"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 font-sans">KCAL</span>
                </div>
                <p className="text-[10px] text-[#8e8e93] font-mono">Active calories goal.</p>
              </div>

              {/* EXERCISE TARGET */}
              <div className="bg-black/20 border border-[#313131] p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Exercise Goal</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-exercise-green shadow-[0_0_6px_#a4ff00]" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="300"
                    required
                    value={exerciseGoal}
                    onChange={(e) => setExerciseGoal(e.target.value)}
                    className="w-full bg-black border border-[#313131] focus:border-zinc-500 outline-none text-base font-bold font-display text-white p-2.5 rounded-xl placeholder:text-zinc-700"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 font-sans">MIN</span>
                </div>
                <p className="text-[10px] text-[#8e8e93] font-mono">Aerobic minutes goal.</p>
              </div>

              {/* STAND TARGET */}
              <div className="bg-black/20 border border-[#313131] p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8e93] font-mono text-[9px] uppercase font-bold">Stand Goal</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-stand-blue shadow-[0_0_6px_#00f0ff]" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={standGoal}
                    onChange={(e) => setStandGoal(e.target.value)}
                    className="w-full bg-black border border-[#313131] focus:border-zinc-500 outline-none text-base font-bold font-display text-white p-2.5 rounded-xl placeholder:text-zinc-700"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 font-sans">HRS</span>
                </div>
                <p className="text-[10px] text-[#8e8e93] font-mono">Hourly active stand breaks.</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#313131]">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-move-pink to-pink-600 hover:from-move-pink/90 hover:to-pink-700 text-white font-bold text-xs rounded-xl transition shadow-[0_0_12px_rgba(255,45,85,0.2)] flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Re-Apply Targets</span>
              </button>
            </div>
          </form>
        </div>

        {/* ACHIEVEMENTS / REWARDS GRID */}
        <div className="bg-[#1c1c1e] rounded-3xl border border-[#313131] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
            <Award className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
              Biometric Awards & Milestones
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 overflow-x-auto">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-black/20 border border-[#313131] p-3.5 rounded-2xl text-center space-y-2 flex flex-col justify-between"
              >
                <div className="relative w-12 h-12 mx-auto">
                  {/* Glowing Award Circle Medallion */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed relative z-10 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    style={{ borderColor: award.color, background: `${award.color}10` }}
                    title={award.desc}
                  >
                    <Award className="w-5 h-5" style={{ color: award.color }} />
                  </div>
                  {/* Outer breathing ring blur shadow */}
                  <div 
                    className="absolute inset-0 rounded-full blur-[6px] opacity-35" 
                    style={{ background: award.color }} 
                  />
                </div>

                <div>
                  <span className="font-display font-medium text-xs text-white block truncate leading-tight">
                    {award.name}
                  </span>
                  <span className="text-[9px] text-[#8e8e93] font-mono uppercase block mt-1">
                    {award.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
