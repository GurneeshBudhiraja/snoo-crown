import { ApplicationPage } from '../App';
import { GameButtonProps } from '../components/GameButton';
import { GameButton, SnooCrownBoardImage, SoundButton } from '../components/index';
import { AnimatePresence } from 'motion/react';

type HomePageProps = {
  onNavigate: (page: ApplicationPage) => void;
};

function HomePage({ onNavigate }: HomePageProps) {
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
      onClick() {
        onNavigate('rules');
      },
    },
  ];
  return (
    <div className="h-full w-full relative text-gray-800 p-10 flex overflow-hidden">
      <AnimatePresence>
        <SnooCrownBoardImage />
      </AnimatePresence>
      {/* Image of Snoo holding the welcome board */}
      {/* Sound option */}
      <SoundButton />
      {/* menu options */}
      <div className="flex flex-col max-w-sm mx-auto items-center justify-start gap-10 flex-1 py-12 lg:py-20">
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
