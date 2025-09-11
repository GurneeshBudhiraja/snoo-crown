import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameOptionsHeader, SnooLeaderboardImage } from '../components';

export type LeaderboardStats = {
  userName: string;
  score: number;
  date: number;
};

function LeaderboardPage() {
  const [scoreInput, setScoreInput] = useState();
  return (
    <>
      <GameOptionsHeader showHomeButton={true} />

      {/* Home button */}
      <AnimatePresence>
        <SnooLeaderboardImage />
      </AnimatePresence>

      <div className="flex-1 w-full flex flex-col overflow-y-auto gap-8 p-4 sm:p-8"></div>
    </>
  );
}

export default LeaderboardPage;
