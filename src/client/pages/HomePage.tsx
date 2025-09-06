import { GameButtonProps } from '../components/GameButton';
import { GameButton, GameOptionsHeader, SnooCrownBoardImage } from '../components/index';
import { AnimatePresence } from 'motion/react';
import useApplicationContext from '../hooks/useApplicationContext';

function HomePage() {
  const { setCurrentPage } = useApplicationContext();
  const MENU_OPTIONS: GameButtonProps[] = [
    // Daily Snoo Challenge
    {
      text: 'Daily Snoo Challenge',
      className: 'bg-game-red hover:bg-game-red/85',
    },
    // Leaderboard
    {
      text: 'Leaderboard',
      className: 'bg-game-green hover:bg-game-green/85',
      onClick: () => setCurrentPage('leaderboard'),
    },
    // Create And Share
    {
      text: 'Create And Share',
      className: 'bg-game-sky hover:bg-game-sky/85',
    },
    // Crown Rules
    {
      text: 'Crown Rules',
      className: 'bg-game-peach hover:bg-game-peach/85',
      onClick: () => setCurrentPage('rules'),
    },
  ];

  return (
    <div className="h-full w-full relative text-gray-800 p-10 flex overflow-clip">
      {/* Image of Snoo holding the welcome board */}
      <AnimatePresence>
        <SnooCrownBoardImage />
      </AnimatePresence>

      <GameOptionsHeader showSoundButton={true} />
      {/* menu options */}
      <div className="flex flex-col max-w-sm mx-auto items-center justify-start 2xs:justify-center gap-5  2xs:gap-10 xs:gap-10 sm:gap-6 flex-1 py-1 2xs:-mt-16  xs:py-12 sm:-mt-3 lg:py-0 overflow-y-auto">
        {MENU_OPTIONS.map((option) => (
          <GameButton
            key={option.text}
            text={option.text}
            className={option.className ?? ''}
            onClick={option.onClick ?? null}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
