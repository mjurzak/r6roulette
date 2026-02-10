import React from 'react';

interface ControlPanelProps {
  side: 'a' | 'd';
  onSideChange: (side: 'a' | 'd') => void;
  count: number;
  maxCount: number;
  onCountChange: (count: number) => void;
  onSpin: () => void;
}

export default function ControlPanel({
  side,
  onSideChange,
  count,
  maxCount,
  onCountChange,
  onSpin,
}: ControlPanelProps) {
  const isAttacker = side === 'a';
  const themeColor = isAttacker ? 'bg-blue-600' : 'bg-orange-600';

  // slider fill percentage based on dynamic max
  const fillPercent = maxCount > 1 ? ((count - 1) / (maxCount - 1)) * 100 : 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">

      {/* side toggle */}
      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full">
        <button
          onClick={() => onSideChange('a')}
          className={`
            px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300
            ${isAttacker
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white'}
          `}
        >
          ATTACK
        </button>
        <button
          onClick={() => onSideChange('d')}
          className={`
            px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-300
            ${!isAttacker
              ? 'bg-orange-600 text-white shadow-lg scale-105'
              : 'text-gray-400 hover:text-white'}
          `}
        >
          DEFEND
        </button>
      </div>

      {/* count slider */}
      <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[180px]">
        <span className="text-xs text-gray-400 whitespace-nowrap">Count</span>
        <input
          type="range"
          min="1"
          max={maxCount}
          value={count}
          onChange={(e) => onCountChange(parseInt(e.target.value))}
          className={`
            flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-700
            ${isAttacker ? 'accent-blue-500' : 'accent-orange-500'}
          `}
          style={{
            backgroundImage: `linear-gradient(to right, ${isAttacker ? '#2563eb' : '#ea580c'} 0%, ${isAttacker ? '#2563eb' : '#ea580c'} ${fillPercent}%, #374151 ${fillPercent}%, #374151 100%)`
          }}
        />
        <span className="text-sm text-white font-bold w-4 text-center">{count}</span>
      </div>

      {/* spin button */}
      <button
        onClick={onSpin}
        className={`
          group
          px-8 py-2.5 rounded-xl font-black text-base tracking-wider text-white
          ${themeColor}
          hover:brightness-110 active:scale-95
          transition-all duration-300
        `}
      >
        <span className="flex items-center gap-2">
          SPIN
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </span>
      </button>

    </div>
  );
}
