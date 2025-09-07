import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameOptionsHeader, SnooLeaderboardImage } from '../components';
import useApplicationContext from '../hooks/useApplicationContext';

export type LeaderboardStats = {
  userName: string;
  score: number;
  date: number;
};

function LeaderboardPage() {
  const [scoreInput, setScoreInput] = useState();
  return (
    <div className="fixed inset-0 flex flex-col bg-game-cream p-0 m-0 z-10 rounded-lg overflow-clip">
      <GameOptionsHeader showHomeButton={true} />

      {/* Home button */}
      <AnimatePresence>
        <SnooLeaderboardImage />
      </AnimatePresence>

      <div className="flex-1 w-full flex flex-col overflow-y-auto gap-8 p-4 sm:p-8"></div>
    </div>
  );
}

export default LeaderboardPage;
