import { useContext, useState } from 'react';
import {
  GameButton,
  GameOptionsHeader,
  GameGrid,
  GameTimer,
  GameCompletionModal,
} from '../components';
import { ApplicationContext } from '../context/context';
import useSound from '../hooks/useSound';
import ApplicationLoadingPage from './ApplicationLoadingPage';
import { useGameValidation } from '../hooks/useGameValidation';
import { useGameData } from '../hooks/useGameData';

export type CellColor = string | null;

function DailySnooChallengePage() {
  // TODO: change to false in production
  const [gameStarted, setGameStarted] = useState(true);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);

  const { setCurrentPage } = useContext(ApplicationContext);
  const { playPingSound } = useSound();

  // Use custom hooks for game data and validation
  const { gameData, isLoading } = useGameData();
  const { validationResult, showCompletionMessage, validateGameState, resetValidation } =
    useGameValidation({
      gridSize: gameData.gridSize,
      cellColors: gameData.cellColors,
    });

  return (
    <div className="h-full w-full relative text-gray-800 p-10 px-4 2xs:px-0 flex justify-center items-center overflow-clip polka-dot-dark">
      <GameOptionsHeader
        showHomeButton={true}
        onHomeButtonClick={() => {
          if (gameStarted) {
            setShowGiveUpModal(true);
          } else {
            setCurrentPage('home');
          }
        }}
      />
      {showGiveUpModal && (
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">Give Up?</div>
          <div className="flex gap-4">
            <GameButton onClick={() => setShowGiveUpModal(false)} text="No" />
            <GameButton onClick={() => setCurrentPage('home')} text="Yes" />
          </div>
        </div>
      )}
      {/* Confirmation message to start the game or not */}
      {!showGiveUpModal && !gameStarted && (
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">Start Today's Challenge?</div>
          <div className="flex gap-4">
            <GameButton onClick={() => setCurrentPage('home')} text="No" />
            <GameButton onClick={() => setGameStarted(true)} text="Yes" />
          </div>
        </div>
      )}
      {/* Main section of the game */}

      {!showGiveUpModal && gameStarted && (
        <div>
          {/* Timer */}
          <GameTimer isActive={gameStarted} />

          {/* Grid */}
          {isLoading ? (
            <ApplicationLoadingPage />
          ) : (
            <GameGrid
              gridSize={gameData.gridSize}
              cellColors={gameData.cellColors}
              onCellClick={() => {
                void playPingSound();
              }}
              validationResult={validationResult}
              onValidationRequest={validateGameState}
            />
          )}

          {/* Game Completion Modal */}
          <GameCompletionModal
            isOpen={showCompletionMessage}
            completionMessage={validationResult?.completionMessage || ''}
            onPlayAgain={() => {
              resetValidation();
            }}
            onBackToHome={() => setCurrentPage('home')}
          />
        </div>
      )}
    </div>
  );
}

export default DailySnooChallengePage;
