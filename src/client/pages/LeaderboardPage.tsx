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
  const [leaderboardStats, setLeaderboardStats] = useState<LeaderboardStats[]>([]);
  // TODO: REPLACE WITH ACTUAL API CALL IN PRODUCTION
  // Imitating the API call
  async function getLeaderboardStats() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const seed = Math.floor(Math.random() * 11);
    if (seed % 2 === 0) {
      setLeaderboardStats([
        {
          userName: 'John Doe',
          score: 100,
          date: Date.now(),
        },
        {
          userName: 'Jane Doe',
          score: 90,
          date: Date.now(),
        },
        {
          userName: 'Jim Doe',
          score: 80,
          date: Date.now(),
        },
      ]);
    } else {
      setLeaderboardStats([]);
    }
  }

  useEffect(() => {
    void getLeaderboardStats();
  }, []);

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
