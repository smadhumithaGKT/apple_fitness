import React, { useState } from 'react';
import { SummaryMetric } from '../types';
import { X, Plus, Calendar, Activity, Zap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MetricDetailModalProps {
  metric: SummaryMetric;
  onClose: () => void;
  onLogData: (metricId: string, value: number) => void;
}

export default function MetricDetailModal(props: MetricDetailModalProps) {
  const { metric, onClose, onLogData } = props;
  const [logValue, setLogValue] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseFloat(logValue);
    if (isNaN(numValue) || numValue <= 0) return;

    onLogData(metric.id, numValue);
    setSuccessMsg(`Logged +${numValue} ${metric.unit}! Dashboard figures updated.`);
    setLogValue('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4500);
  };

  // Compute stats based on Sparkline
  const values = metric.sparkline;
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const avgVal = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));

  // Render a large modern graph using beautiful pure SVG
  const renderLargeGraph = () => {
    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 25;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    const xValues = values.map((_, i) => paddingLeft + (i / (values.length - 1)) * plotWidth);
    const yValues = values.map((val) => {
      const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;
      return height - paddingBottom - ((val - minVal) / range) * plotHeight;
    });

    // Make curve lines or smooth segments
    const pointsString = xValues.map((x, idx) => `${x},${yValues[idx]}`).join(' L ');
    const areaPointsString = `M ${xValues[0]},${height - paddingBottom} L ` + 
      xValues.map((x, idx) => `${x},${yValues[idx]}`).join(' L ') + 
      ` L ${xValues[xValues.length - 1]},${height - paddingBottom} Z`;

    return (
      <svg className="w-full h-auto overflow-visible select-none" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grid-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#27272a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#27272a" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Y Axis line grids */}
        <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="url(#grid-fade)" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1={paddingLeft} y1={paddingTop + plotHeight / 2} x2={width - paddingRight} y2={paddingTop + plotHeight / 2} stroke="url(#grid-fade)" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#27272a" strokeWidth="1" />

        {/* Labels for Y limits */}
        <text x={paddingLeft - 10} y={paddingTop + 4} fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">{maxVal}</text>
        <text x={paddingLeft - 10} y={paddingTop + plotHeight / 2 + 4} fill="#52525b" fontSize="10" fontFamily="monospace" textAnchor="end">{Math.round((maxVal + minVal) / 2)}</text>
        <text x={paddingLeft - 10} y={height - paddingBottom + 4} fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">{minVal}</text>

        {/* Gradient fill section */}
        <path d={areaPointsString} fill="url(#gradient-area)" />

        {/* Path line */}
        <path d={`M ${pointsString}`} fill="none" stroke={metric.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive dots + indicators */}
        {xValues.map((x, idx) => (
          <g key={idx} className="cursor-pointer group">
            <circle cx={x} cy={yValues[idx]} r="4" fill={metric.color} stroke="#000000" strokeWidth="1.5" />
            <circle cx={x} cy={yValues[idx]} r="8" fill={metric.color} stroke="none" className="opacity-0 hover:opacity-20 transition-opacity" />
            
            {/* Pop values on top */}
            <text x={x} y={yValues[idx] - 10} fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {values[idx]}
            </text>
          </g>
        ))}

        {/* Days of week display */}
        {daysOfWeek.map((day, idx) => {
          const x = paddingLeft + (idx / (daysOfWeek.length - 1)) * plotWidth;
          return (
            <text key={day} x={x} y={height - paddingBottom + 16} fill="#71717a" fontSize="10" fontWeight="500" textAnchor="middle">
              {day}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div id="metric-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-[#1c1c1e] border border-[#313131] rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Glow accent */}
        <div 
          className="absolute top-0 inset-x-0 h-[2px] opacity-70"
          style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-black/40 border border-[#313131]">
              <Activity className="w-5 h-5" style={{ color: metric.color }} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#8e8e93]">Apple Analytics</span>
              <h2 className="text-xl font-bold font-display text-white">{metric.label} Trends</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-zinc-900 border border-[#313131] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main big figure state */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8e8e93] block">Current Level</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold font-display text-white tracking-tight">{metric.value}</span>
                <span className="text-sm font-medium text-[#8e8e93]">{metric.unit}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8e8e93] block">7D Status</span>
              <div className="flex items-center gap-1.5 justify-end">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-mono font-bold text-green-400">Better Pace</span>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-black/20 border border-[#313131] p-4 rounded-2xl relative">
            <span className="absolute top-3 right-4 text-[9px] font-mono text-zinc-500 uppercase">Mon - Sun</span>
            {renderLargeGraph()}
          </div>

          {/* Statistics widgets */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/30 p-3 rounded-xl border border-[#313131] text-center">
              <span className="text-[9px] uppercase font-mono text-[#8e8e93] block">7D Average</span>
              <span className="text-base font-bold font-display text-white">{avgVal}</span>
              <span className="text-[9px] text-[#8e8e93] block mt-0.5">{metric.unit}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-[#313131] text-center">
              <span className="text-[9px] uppercase font-mono text-[#8e8e93] block">Peak Performance</span>
              <span className="text-base font-bold font-display text-white">{maxVal}</span>
              <span className="text-[9px] text-[#8e8e93] block mt-0.5">{metric.unit}</span>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-[#313131] text-center">
              <span className="text-[9px] uppercase font-mono text-[#8e8e93] block">Low Point</span>
              <span className="text-base font-bold font-display text-white">{minVal}</span>
              <span className="text-[9px] text-[#8e8e93] block mt-0.5">{metric.unit}</span>
            </div>
          </div>

          {/* Dialog message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl flex items-center gap-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Log Entry Form */}
          <form onSubmit={handleLogSubmit} className="bg-black/30 p-4 rounded-2xl border border-[#313131] space-y-3.5">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                Log New Entry
              </h4>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="number"
                  step="any"
                  required
                  placeholder={`Amount relative to ${metric.unit} (e.g. 50)`}
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  className="w-full bg-black border border-[#313131] focus:border-zinc-700 outline-none text-sm text-white px-3.5 py-2.5 rounded-xl placeholder:text-zinc-700 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono font-bold">
                  {metric.unit}
                </span>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl hover:translate-y-[-1px] active:translate-y-[0] transition-all"
              >
                Log Entry
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              Note: Logging values dynamically updates your active Move ring, exercise scores, or standard logs real-time!
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
