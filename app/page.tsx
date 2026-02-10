'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import defenders from '../public/defenders.json';
import attackers from '../public/attackers.json';
import OperatorCard from '../components/OperatorCard';
import ControlPanel from '../components/ControlPanel';
import OperatorGrid from '../components/OperatorGrid';
import SearchBar from '../components/SearchBar';
import BannedList from '../components/BannedList';
import SpinHistory from '../components/SpinHistory';

interface OperatorsResponse {
  operator_names: string[];
  operator_icons: string[];
}

interface HistoryEntry {
  id: number;
  side: 'a' | 'd';
  operators: { name: string; icon: string }[];
}

const emptyResponse: OperatorsResponse = { operator_names: [], operator_icons: [] };

// helper to get all operators for a side
const getAllOperatorsBySide = (side: 'a' | 'd'): OperatorsResponse => {
  const operator_names: string[] = [];
  const operator_icons: string[] = [];
  const source = side === 'a' ? attackers.attackers : defenders.defenders;

  source.forEach((operator: any) => {
    operator_names.push(operator.name);
    operator_icons.push(operator.icon);
  });

  return { operator_names, operator_icons };
};

// helper to get random operators respecting bans
const getRandomOperatorsBySide = (
  side: 'a' | 'd',
  numOperators: number,
  attackerBans: string[],
  defenderBans: string[]
): OperatorsResponse => {
  const operator_names: string[] = [];
  const operator_icons: string[] = [];
  const availableOperators: { name: string; icon: string }[] = [];

  if (side === 'a') {
    attackers.attackers.forEach((operator: any) => {
      if (!attackerBans.includes(operator.name)) {
        availableOperators.push({ name: operator.name, icon: operator.icon });
      }
    });
  } else if (side === 'd') {
    defenders.defenders.forEach((operator: any) => {
      if (!defenderBans.includes(operator.name)) {
        availableOperators.push({ name: operator.name, icon: operator.icon });
      }
    });
  }

  const tempAvailable = [...availableOperators];
  while (operator_names.length < numOperators && tempAvailable.length > 0) {
    const randomIndex = Math.floor(Math.random() * tempAvailable.length);
    const selectedOperator = tempAvailable.splice(randomIndex, 1)[0];
    operator_names.push(selectedOperator.name);
    operator_icons.push(selectedOperator.icon);
  }

  return { operator_names, operator_icons };
};

export default function Roulette() {
  const [side, setSide] = useState<'a' | 'd'>('a');
  const [count, setCount] = useState(1);
  const [operators, setOperators] = useState<OperatorsResponse>(emptyResponse);
  const [bannedOperators, setBannedOperators] = useState<{ a: string[], d: string[] }>({ a: [], d: [] });
  // store random results per side so they persist when switching
  const [randomOperators, setRandomOperators] = useState<{ a: OperatorsResponse, d: OperatorsResponse }>({
    a: emptyResponse,
    d: emptyResponse,
  });
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [nextHistoryId, setNextHistoryId] = useState(1);
  // incremented on each spin to re-trigger the pop-in animation
  const [spinKey, setSpinKey] = useState(0);

  // fetch operators when side changes
  useEffect(() => {
    const response = getAllOperatorsBySide(side);
    setOperators(response);
  }, [side]);

  // compute available count (total minus bans for current side)
  const availableCount = operators.operator_names.length - bannedOperators[side].length;

  // clamp slider max to available operators
  const maxCount = Math.max(1, Math.min(5, availableCount));

  // auto-clamp count when bans reduce available pool below current count
  useEffect(() => {
    if (count > maxCount) {
      setCount(maxCount);
    }
  }, [maxCount, count]);

  // current side's random result
  const currentRandom = randomOperators[side];

  const handleOperatorClick = (operator: string) => {
    if (bannedOperators[side].includes(operator)) {
      setBannedOperators({
        ...bannedOperators,
        [side]: bannedOperators[side].filter(op => op !== operator)
      });
    } else {
      // prevent banning everyone
      if (availableCount <= 1) return;
      setBannedOperators({
        ...bannedOperators,
        [side]: [...bannedOperators[side], operator]
      });
    }
  };

  const handleClearAllBans = () => {
    setBannedOperators({
      ...bannedOperators,
      [side]: []
    });
  };

  const handleSideChange = (newSide: 'a' | 'd') => {
    setSide(newSide);
  };

  const fetchRandomOperators = () => {
    if (availableCount <= 0) return;
    const response = getRandomOperatorsBySide(side, count, bannedOperators.a, bannedOperators.d);
    setRandomOperators(prev => ({ ...prev, [side]: response }));
    setSpinKey(prev => prev + 1);

    // record in history
    const ops = response.operator_names.map((name, i) => ({
      name,
      icon: response.operator_icons[i]
    }));
    setHistory(prev => [{ id: nextHistoryId, side, operators: ops }, ...prev]);
    setNextHistoryId(prev => prev + 1);
  };

  // prepare data for components
  const allMappedOperators = operators.operator_names.map((name, index) => ({
    name,
    icon: operators.operator_icons[index]
  }));

  const filteredOperators = allMappedOperators.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen w-full bg-[#121212] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-orange-900/10 pointer-events-none" />

      {/* history sidebar */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 z-40
          bg-[#1a1a1a]/95 backdrop-blur-md border-l border-white/10
          transform transition-transform duration-300 ease-in-out
          ${historyOpen ? 'translate-x-0' : 'translate-x-full'}
          overflow-y-auto p-4
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-white">Spin History</span>
          <button
            onClick={() => setHistoryOpen(false)}
            className="text-gray-400 hover:text-white transition-colors text-lg leading-none cursor-pointer"
            aria-label="Close history"
          >
            x
          </button>
        </div>
        <SpinHistory history={history} onClear={() => setHistory([])} />
      </div>

      {/* history toggle button -- fades out when sidebar opens */}
      <button
        onClick={() => setHistoryOpen(true)}
        className={`
          fixed top-4 right-4 z-50
          flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-white/10 hover:bg-white/20 border border-white/10
          text-sm text-gray-200 hover:text-white
          transition-all duration-300 ease-in-out cursor-pointer
          ${historyOpen
            ? 'opacity-0 pointer-events-none translate-x-4'
            : 'opacity-100 translate-x-0'}
        `}
        aria-label="Open spin history"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
        {history.length > 0 && (
          <span className="bg-white/20 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {history.length}
          </span>
        )}
      </button>

      <div className="relative mx-auto max-w-7xl px-4 py-6 flex flex-col items-center">
        {/* header */}
        <h1 className="mb-4 text-center leading-none">
          <span className="block text-4xl md:text-5xl font-black italic tracking-tight text-white pr-2">
            R6
          </span>
          <span className="block text-lg md:text-xl font-light tracking-[0.3em] uppercase text-gray-400 mt-0.5">
            Roulette
          </span>
        </h1>

        {/* controls */}
        <ControlPanel
          side={side}
          onSideChange={handleSideChange}
          count={count}
          maxCount={maxCount}
          onCountChange={setCount}
          onSpin={fetchRandomOperators}
        />

        {/* random results -- animated on each spin via spinKey */}
        {currentRandom.operator_names.length > 0 && (
          <div key={spinKey} className="w-full flex flex-col items-center mb-4 animate-fade-in">
            <div className="flex flex-wrap gap-4 justify-center p-4 bg-white/5 rounded-2xl border border-white/10">
              {currentRandom.operator_names.map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="animate-pop-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <OperatorCard
                    name={name}
                    icon={currentRandom.operator_icons[idx]}
                    size="md"
                    borderColor="#44db1f"
                    isInteractive={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        {/* search & banned list */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} />
          <BannedList
            bannedOperators={bannedOperators[side]}
            allOperators={allMappedOperators}
            onUnban={handleOperatorClick}
            onClearAll={handleClearAllBans}
          />
        </div>

        {/* operator grid */}
        <OperatorGrid
          operators={filteredOperators}
          bannedOperators={bannedOperators[side]}
          onOperatorClick={handleOperatorClick}
          side={side}
        />
      </div>
    </main>
  );
}
