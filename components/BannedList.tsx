import React from 'react';

interface BannedListProps {
  bannedOperators: string[];
  allOperators?: { name: string; icon: string }[];
  onUnban?: (name: string) => void;
  onClearAll?: () => void;
}

export default function BannedList({ bannedOperators, allOperators = [], onUnban, onClearAll }: BannedListProps) {
  if (bannedOperators.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-red-400 font-bold tracking-widest text-xs uppercase">Banned:</span>
      {bannedOperators.map((name) => {
        const op = allOperators.find(o => o.name === name);
        const icon = op ? op.icon : '';

        return (
          <button
            key={name}
            onClick={() => onUnban && onUnban(name)}
            title={`Unban ${name}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 border border-red-500/40 rounded-lg text-red-200 text-sm cursor-pointer hover:bg-red-900/50 transition-colors"
          >
            {icon && <img src={icon} alt={name} className="w-5 h-5 object-contain" />}
            {name}
            <span className="text-red-400 ml-0.5">x</span>
          </button>
        );
      })}
      {bannedOperators.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          title="Clear all bans"
          className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
