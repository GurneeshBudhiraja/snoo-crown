import { GameButtonProps } from '../components/GameButton';
import { GameButton, GameOptionsHeader, SnooCrownBoardImage } from '../components/index';
import { AnimatePresence } from 'motion/react';
import useApplicationContext from '../hooks/useApplicationContext';
import { ApplicationLoadingPage } from './page';

function HomePage() {
  const { setCurrentPage, isPostLoading, isCustomPost } = useApplicationContext();
  const MENU_OPTIONS: GameButtonProps[] = [
    // Play custom post
    // {
    //   text: 'Play Custom Post',
    //   className: 'bg-game-light hover:bg-game-light/85',
    //   forCustomPost: isCustomPost,
    // },
    // Daily Snoo Challenge
    {
      text: 'Daily Snoo Challenge',
      className: 'bg-game-red hover:bg-game-red/85',
      onClick: () => setCurrentPage('dailySnooChallenge'),
    },
    // Create And Share
    {
      text: 'Create And Share',
      className: 'bg-game-sky hover:bg-game-sky/85',
      onClick: () => setCurrentPage('createAndShare'),
      forCustomPost: !isCustomPost,
    },
    // Leaderboard
    {
      text: 'Leaderboard',
      className: 'bg-game-green hover:bg-game-green/85',
      onClick: () => setCurrentPage('leaderboard'),
    },

    // Crown Rules
    {
      text: 'Crown Rules',
      className: 'bg-game-peach hover:bg-game-peach/85',
      onClick: () => setCurrentPage('rules'),
    },
  ];

  return (
    <div className="h-full w-full relative text-gray-800 p-10 px-4 2xs:px-0 flex overflow-clip polka-dot-dark">
      {/* Image of Snoo holding the welcome board */}
      <AnimatePresence>
        <SnooCrownBoardImage />
      </AnimatePresence>

      <GameOptionsHeader showSoundButton={true} />
      {/* menu options */}
      <div className="flex flex-col max-w-sm mx-auto items-center justify-start 2xs:justify-center gap-5  2xs:gap-10 xs:gap-10 sm:gap-6 flex-1 py-1 mt-4 2xs:-mt-16  xs:py-12 sm:-mt-3 lg:py-0 overflow-y-auto">
        <div
          onClick={async () => {
            try {
              const response = await fetch('/api/post/clear', {
                method: 'DELETE',
              });
              const data = await response.json();
              console.log('Quiz of the day deleted', data);
            } catch (error) {
              console.log('Error deleting quiz of the day', (error as Error).message);
            }
          }}
        >
          Delete Quiz of the Day
        </div>
        {MENU_OPTIONS.filter((option) => option.forCustomPost !== false).map((option) => (
          <GameButton
            key={option.text}
            text={option.text}
            className={option.className ?? ''}
            onClick={option.onClick ?? null}
            disabled={option.disabled ?? false}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
