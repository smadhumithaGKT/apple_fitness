import React, { useState } from 'react';
import { FriendActivity } from '../types';
import { INITIAL_FRIENDS } from '../data';
import { Share2, Swords, MessageCircle, Heart, Flame, Send, UserPlus, Check, Award, FlameKindling } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SharingTab() {
  const [friends, setFriends] = useState<FriendActivity[]>(INITIAL_FRIENDS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [duels, setDuels] = useState<Record<string, 'inactive' | 'pending' | 'active'>>({
    'f-1': 'active',
    'f-2': 'inactive',
    'f-3': 'active',
    'f-4': 'inactive',
  });
  
  // Custom motivating messages state
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [showReactionPanel, setShowReactionPanel] = useState<string | null>(null);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate appending a default friend based on name extraction
    const extractedName = inviteEmail.split('@')[0];
    const capitalizedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    const newFriend: FriendActivity = {
      id: `f-${Date.now()}`,
      name: `${capitalizedName} (Pending)`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      movePercent: 0,
      exercisePercent: 0,
      standPercent: 0,
      lastActive: 'Just now',
    };

    setFriends([newFriend, ...friends]);
    setInviteEmail('');
    setSuccessMsg(`Sent a sharing request to ${inviteEmail}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleChallengeToggle = (id: string) => {
    setDuels(prev => {
      const current = prev[id] || 'inactive';
      let nextState: 'inactive' | 'pending' | 'active' = 'inactive';
      if (current === 'inactive') nextState = 'pending';
      else if (current === 'pending') nextState = 'active';
      else nextState = 'inactive';
      return { ...prev, [id]: nextState };
    });
  };

  const sendReaction = (friendId: string, reactionEmoji: string) => {
    setReactions(prev => ({
      ...prev,
      [friendId]: `Sent ${reactionEmoji}!`
    }));
    setShowReactionPanel(null);

    setTimeout(() => {
      setReactions(prev => {
        const copy = { ...prev };
        delete copy[friendId];
        return copy;
      });
    }, 3000);
  };

  // Render a microscopic 3-ring circular SVG badge for each friend
  const renderMiniRings = (movePercent: number, exercisePercent: number, standPercent: number) => {
    const size = 32;
    const center = size / 2;
    
    // Rads
    const outerR = 12;
    const midR = 9;
    const innerR = 6;

    // Circumferences
    const outC = 2 * Math.PI * outerR;
    const midC = 2 * Math.PI * midR;
    const innC = 2 * Math.PI * innerR;

    const calcOffset = (pct: number, circ: number) => {
      const fraction = Math.min(Math.max(pct / 100, 0), 0.999);
      return circ - fraction * circ;
    };

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Outer Ring */}
        <circle cx={center} cy={center} r={outerR} stroke="#ff1256" strokeWidth="2.5" fill="none" opacity="0.15" />
        <circle cx={center} cy={center} r={outerR} stroke="#ff1256" strokeWidth="2.5" strokeDasharray={outC} strokeDashoffset={calcOffset(movePercent, outC)} strokeLinecap="round" fill="none" />

        {/* Middle Ring */}
        <circle cx={center} cy={center} r={midR} stroke="#00ff3c" strokeWidth="2.5" fill="none" opacity="0.15" />
        <circle cx={center} cy={center} r={midR} stroke="#00ff3c" strokeWidth="2.5" strokeDasharray={midC} strokeDashoffset={calcOffset(exercisePercent, midC)} strokeLinecap="round" fill="none" />

        {/* Inner Ring */}
        <circle cx={center} cy={center} r={innerR} stroke="#00f0ff" strokeWidth="2.5" fill="none" opacity="0.15" />
        <circle cx={center} cy={center} r={innerR} stroke="#00f0ff" strokeWidth="2.5" strokeDasharray={innC} strokeDashoffset={calcOffset(standPercent, innC)} strokeLinecap="round" fill="none" />
      </svg>
    );
  };

  return (
    <div id="sharing-tab-container" className="space-y-6">
      
      {/* SHARING STAT MASTER SUMMARY HERO */}
      <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-[#313131] flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-move-pink/5 rounded-full blur-[70px] pointer-events-none" />
        
        <div className="space-y-2 max-w-md text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-move-pink/10 border border-move-pink/25 text-move-pink text-[10px] font-bold font-mono uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" />
            <span>Activity Circle Sharing</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">
            See closing rings. Push friends closer.
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Healthy friction keeps you logging workouts. Review circles, initiate 7-day sweat duels, and ping quick emoji reactions directly from the watch sharing nodes.
          </p>
        </div>

        {/* INVITE NEW FRIENDS BAR */}
        <form onSubmit={handleInviteSubmit} className="w-full md:w-auto flex-shrink-0 bg-black/40 border border-[#313131] p-3.5 rounded-2xl space-y-2.5 max-w-sm">
          <div className="flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-zinc-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Invite to Share</span>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              required
              placeholder="friend@contact.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="bg-black border border-[#313131] focus:border-zinc-500 outline-none text-xs text-white px-3 py-2 rounded-xl placeholder:text-zinc-700 flex-grow"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-move-pink text-white font-bold text-xs rounded-xl hover:bg-move-pink/90 transition-all flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Send</span>
            </button>
          </div>
          <AnimatePresence>
            {successMsg && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] text-green-400 font-mono"
              >
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* SHARING FEED / LEADERBOARD */}
      <div id="sharing-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEADERBOARD LIST - Left 2 Columns */}
        <div className="md:col-span-2 bg-[#1c1c1e] rounded-3xl border border-[#313131] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#313131] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              Friend Leaderboard
            </h3>
            <span className="text-[10px] text-[#8e8e93] font-mono font-bold">
              Sorted by Move Ring completion
            </span>
          </div>

          <div className="space-y-3">
            {friends.map((friend, index) => {
              const duelStatus = duels[friend.id] || 'inactive';
              return (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-[#313131] hover:bg-black/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <span className="w-5 text-center font-mono text-zinc-500 text-xs font-bold">
                      #{index + 1}
                    </span>

                    {/* Avatar */}
                    <img
                      src={friend.avatarUrl}
                      alt={friend.name}
                      className="w-10 h-10 object-cover rounded-full border border-[#313131]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Meta */}
                    <div>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                        {friend.name}
                        {duelStatus === 'active' && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[8px] font-semibold uppercase tracking-wider font-mono">
                            <Swords className="w-2.5 h-2.5" /> Duel
                          </span>
                        )}
                      </h4>
                      {friend.recentWorkout ? (
                        <p className="text-[10.5px] text-zinc-400 mt-0.5 font-sans truncate max-w-[150px] sm:max-w-xs">
                          {friend.recentWorkout} <span className="text-[9px] text-[#8e8e93] font-mono">({friend.lastActive})</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-[#8e8e93] font-mono">No recent sessions registered</p>
                      )}
                    </div>
                  </div>

                  {/* MINI RINGS & ACTIONS */}
                  <div className="flex items-center gap-4">
                    {/* Compact percent metrics */}
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-move-pink font-mono">{friend.movePercent}%</div>
                      <span className="text-[9px] text-[#8e8e93] font-mono uppercase">Move Target</span>
                    </div>

                    {/* Concentric rings render */}
                    {renderMiniRings(friend.movePercent, friend.exercisePercent, friend.standPercent)}

                    {/* Reaction trigger */}
                    <div className="relative">
                      {reactions[friend.id] ? (
                        <span className="text-xs font-mono font-bold text-green-300 pr-2">
                          {reactions[friend.id]}
                        </span>
                      ) : (
                        <button
                          onClick={() => setShowReactionPanel(showReactionPanel === friend.id ? null : friend.id)}
                          className="p-1.5 bg-black/40 border border-[#313131] hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* EMOJI COMPACT POPUP */}
                      {showReactionPanel === friend.id && (
                        <div className="absolute right-0 bottom-8 z-30 bg-[#1c1c1e] border border-[#313131] p-2 rounded-xl flex gap-1.5 shadow-2xl">
                          {['🔥', '👏', '💪', '👑', '💙'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => sendReaction(friend.id, emoji)}
                              className="p-1 hover:bg-black rounded transition text-sm hover:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DUELS CHALLENGES PANEL - Right 1 Column */}
        <div id="sharing-challenges" className="bg-[#1c1c1e] rounded-3xl border border-[#313131] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#313131] pb-3">
              <Swords className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Active Duels
              </h3>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Initiate a 7-day duel. Match calories burned point for point. Winner takes home the custom Competitor badge!
            </p>

            <div className="space-y-2.5 pt-2">
              {friends.slice(0, 3).map((friend) => {
                const duelStatus = duels[friend.id] || 'inactive';
                return (
                  <div key={friend.id} className="p-3 bg-black/20 border border-[#313131] text-xs rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">{friend.name}</span>
                      <span className="text-[9px] text-[#8e8e93] font-mono">
                        {duelStatus === 'active' ? '👉 Score: 410 - 280 (You are leading)' : duelStatus === 'pending' ? '⏳ Request Sent...' : '⚔️ Available'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleChallengeToggle(friend.id)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded font-mono transition-colors ${
                        duelStatus === 'active'
                          ? 'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-black'
                          : duelStatus === 'pending'
                            ? 'bg-black border border-[#313131] text-zinc-400'
                            : 'bg-amber-500 text-black hover:bg-amber-400'
                      }`}
                    >
                      {duelStatus === 'active' ? 'End Duel' : duelStatus === 'pending' ? 'Pending' : 'Invite'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-black/40 p-3.5 rounded-2xl border border-[#313131] text-center space-y-1 mt-4">
            <Award className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="font-display font-semibold text-white text-xs block">Streak Competitor Badge</span>
            <span className="text-[9px] text-zinc-500 font-mono">Earned by defeating 3 friends</span>
          </div>

        </div>

      </div>

    </div>
  );
}
