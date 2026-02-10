import React from 'react';
import OperatorCard from './OperatorCard';

interface OperatorGridProps {
  operators: { name: string; icon: string }[];
  bannedOperators: string[];
  onOperatorClick: (name: string) => void;
  side: 'a' | 'd';
}

export default function OperatorGrid({
  operators,
  bannedOperators,
  onOperatorClick,
  side,
}: OperatorGridProps) {
  return (
    // key={side} forces remount on side change, triggering the fade-in animation
    <div key={side} className="w-full mx-auto p-2 animate-fade-in">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-2 gap-y-4 justify-items-center">
        {operators.map((op) => {
          const isBanned = bannedOperators.includes(op.name);

          return (
            <div key={op.name}>
              <OperatorCard
                name={op.name}
                icon={op.icon}
                isBanned={isBanned}
                onClick={() => onOperatorClick(op.name)}
                isInteractive={true}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {operators.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          No operators found. Try adjusting your search.
        </div>
      )}
    </div>
  );
}
