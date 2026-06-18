import React, { useState } from 'react';
import { SummaryMetric } from '../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SummaryCardsProps {
  metrics: SummaryMetric[];
  onMetricClick: (metric: SummaryMetric) => void;
}

export default function SummaryCards(props: SummaryCardsProps) {
  const { metrics, onMetricClick } = props;

  // Helper to dynamically resolve Lucide icons securely
  const renderIcon = (name: string, color: string) => {
    // Falls back to Activity fallback in case icon name is missing
    const IconComponent = (Icons as any)[name] || Icons.Activity;
    return <IconComponent className="w-5 h-5" style={{ color }} />;
  };

  // Helper to draw a beautiful, zero-dependency SVG sparkline path
  const renderSparkline = (points: number[], color: string) => {
    if (points.length < 2) return null;
    const width = 80;
    const height = 28;
    const padding = 2;
    
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;

    const coords = points.map((val, idx) => {
      const x = padding + (idx / (points.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((val - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(' L ')}`;

    return (
      <svg width={width} height={height} className="overflow-visible opacity-80">
        {/* Glow behind the sparkline */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'blur(1.5px)', opacity: 0.4 }}
        />
        {/* Actual sharp sparkline path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Endpoint marker dot */}
        <circle
          cx={padding + (points.length - 1) / (points.length - 1) * (width - 2 * padding)}
          cy={height - padding - ((points[points.length - 1] - min) / range) * (height - 2 * padding)}
          r="2.5"
          fill={color}
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div id="summary-cards-section" className="flex flex-col gap-3 py-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          Interactive Metrics Summary
        </h3>
        <span className="text-[10px] text-zinc-500 font-medium font-mono hidden md:inline">
          Swipe left / Click for detailed trend analysis
        </span>
      </div>

      {/* Horizontal Scroll view */}
      <div 
        id="summary-scroll-viewport" 
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x scroll-smooth -mx-4 md:-mx-0 px-4 md:px-0"
      >
        {metrics.map((metric) => {
          const isUp = metric.trend === 'up';
          const isDown = metric.trend === 'down';
          
          return (
            <motion.div
              key={metric.id}
              id={`metric-card-${metric.id}`}
              onClick={() => onMetricClick(metric)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group min-w-[175px] md:min-w-[190px] flex-shrink-0 bg-[#1c1c1e] p-4 rounded-2xl border border-[#313131] hover:border-[#454545] transition-all duration-300 cursor-pointer snap-start relative overflow-hidden"
            >
              {/* Radial card hover background spotlight highlight */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(40px circle at 80% 20%, ${metric.color}15, transparent 100%)`
                }}
              />

              {/* CARD TOP ROW */}
              <div className="flex items-start justify-between mb-3 w-full">
                <div className="p-2 rounded-xl bg-black/40 border border-[#313131] group-hover:bg-[#1c1c1e]/50 group-hover:border-zinc-500/50 transition-colors">
                  {renderIcon(metric.iconName, metric.color)}
                </div>
                {metric.changePercent !== undefined && metric.changePercent !== 0 && (
                  <span className={`text-[11px] font-semibold font-mono flex items-center px-2 py-0.5 rounded-full ${
                    isUp 
                      ? 'text-green-400 bg-green-500/10 border border-green-500/20' 
                      : isDown 
                        ? 'text-red-400 bg-red-500/10 border border-red-500/20' 
                        : 'text-zinc-400 bg-zinc-500/10 border border-zinc-500/20'
                  }`}>
                    {isUp ? '+' : ''}{metric.changePercent}%
                  </span>
                )}
              </div>

              {/* CARD METRIC CONTENT */}
              <div className="space-y-0.5 mb-3">
                <span className="text-zinc-500 font-medium text-xs font-mono uppercase tracking-wider block">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-1 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-2xl font-bold font-display tracking-tight text-white">
                    {metric.value}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium font-sans">
                    {metric.unit}
                  </span>
                </div>
              </div>

              {/* SPARKLINE OR GRAPH */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-900/40">
                <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mt-1">
                  7-Day Trend
                </span>
                <div className="h-6 flex items-end">
                  {renderSparkline(metric.sparkline, metric.color)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
