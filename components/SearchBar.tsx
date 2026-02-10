import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xs group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search operators..."
        className="
          w-full pl-9 pr-3 py-2
          bg-white/5 border border-white/10
          rounded-full text-sm
          text-white placeholder-gray-500
          focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/5
          transition-all duration-300
        "
        aria-label="Search operators"
      />
    </div>
  );
}
