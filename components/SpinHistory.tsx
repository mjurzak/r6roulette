import React from 'react';

interface HistoryEntry {
  id: number;
  side: 'a' | 'd';
  operators: { name: string; icon: string }[];
}

interface SpinHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export default function SpinHistory({ history, onClear }: SpinHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-gray-600 text-xs italic text-center py-4">
        No spins yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-400 font-bold tracking-widest text-[10px] uppercase">History</span>
        <button
          onClick={onClear}
          className="text-[10px] text-gray-500 hover:text-white transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg border border-white/5"
        >
          {/* side badge */}
          <span
            className={`
              text-[10px] font-bold uppercase px-1.5 py-0.5 rounded
              ${entry.side === 'a'
                ? 'bg-blue-600/30 text-blue-300'
                : 'bg-orange-600/30 text-orange-300'}
            `}
          >
            {entry.side === 'a' ? 'ATK' : 'DEF'}
          </span>
          {/* operator icons */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {entry.operators.map((op, i) => (
              <img
                key={`${op.name}-${i}`}
                src={op.icon}
                alt={op.name}
                title={op.name}
                className="w-5 h-5 object-contain shrink-0"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
