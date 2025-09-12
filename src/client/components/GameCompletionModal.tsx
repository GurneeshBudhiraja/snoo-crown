import { useContext } from 'react';
import GameButton from './GameButton';
import { ApplicationContext } from '../context/context';

type GameCompletionModalProps = {
  isOpen: boolean;
};

export default function GameCompletionModal({ isOpen }: GameCompletionModalProps) {
  const { setCurrentPage } = useContext(ApplicationContext);
  if (!isOpen) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
      <div className="text-2xl font-bold text-game-dark bg-game-cream max-w-md mx-auto">
        Congratulations! You've solved the today's challenge!
      </div>
      <GameButton
        onClick={() => {
          setCurrentPage('home');
        }}
        text="Back to Home"
        className="bg-game-red"
      />
    </div>
  );
}
