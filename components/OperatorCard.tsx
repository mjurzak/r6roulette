import React from 'react';

interface OperatorCardProps {
  name: string;
  icon: string;
  isBanned?: boolean;
  onClick?: () => void;
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  borderColor?: string;
}

export default function OperatorCard({
  name,
  icon,
  isBanned = false,
  onClick,
  isInteractive = true,
  size = 'md',
  borderColor
}: OperatorCardProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 p-1 text-xs',
    md: 'w-24 h-24 p-2 text-sm',
    lg: 'w-32 h-32 p-3 text-base',
  };

  const containerSizeClasses = {
    sm: 'w-20',
    md: 'w-28',
    lg: 'w-40',
  };

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        ${containerSizeClasses[size]}
        rounded-2xl transition-all duration-300 ease-out
        ${isInteractive ? 'cursor-pointer hover:scale-105 hover:brightness-110' : ''}
        ${isBanned ? 'opacity-75' : 'opacity-100'}
        group
      `}
      onClick={isInteractive ? onClick : undefined}
    >
      <div
        className={`
          relative flex items-center justify-center
          ${sizeClasses[size]}
          rounded-2xl
          bg-white/5 backdrop-blur-md border border-white/10
          shadow-lg
          transition-all duration-300
          ${isBanned ? 'bg-red-900/20 border-red-500/30' : 'group-hover:bg-white/10 group-hover:border-white/20'}
        `}
        style={borderColor && !isBanned ? { borderColor: borderColor, borderWidth: '2px' } : {}}
      >
        <img
          src={icon}
          alt={name}
          className={`
            w-full h-full object-contain drop-shadow-md
            transition-all duration-300
            ${isBanned ? 'opacity-60 brightness-150 contrast-75 saturate-50' : ''}
          `}
          loading="lazy"
        />

        {/* ban overlay -- always rendered, visibility via opacity for smooth transition */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center
            text-red-500 font-bold text-xl select-none
            transition-opacity duration-300
            ${isBanned ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <span className="sr-only">Banned</span>
          x
        </div>
      </div>

      <span
        className={`
          mt-2 font-medium text-center text-gray-200 truncate w-full px-1
          ${size === 'sm' ? 'text-xs' : 'text-sm'}
          group-hover:text-white transition-colors duration-300
        `}
      >
        {name}
      </span>
    </div>
  );
}
