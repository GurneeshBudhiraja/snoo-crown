import GameButton from './GameButton';

type GameCompletionModalProps = {
  isOpen: boolean;
  completionMessage: string;
  onPlayAgain: () => void;
  onBackToHome: () => void;
};

export default function GameCompletionModal({
  isOpen,
  completionMessage,
  onPlayAgain,
  onBackToHome,
}: GameCompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-game-cream border-4 border-game-dark rounded-lg p-8 text-center max-w-md mx-4">
        <div className="text-3xl font-bold text-game-dark mb-4">{completionMessage}</div>
        <div className="text-lg text-game-dark mb-6">
          Congratulations! You've solved the Queen's game puzzle!
        </div>
        <div className="flex gap-4 justify-center">
          <GameButton text="Play Again" onClick={onPlayAgain} />
          <GameButton text="Back to Home" onClick={onBackToHome} />
        </div>
      </div>
    </div>
  );
}
