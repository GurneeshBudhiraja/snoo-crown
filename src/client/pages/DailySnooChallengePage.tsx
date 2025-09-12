import { useContext, useState, useEffect, useCallback } from 'react';
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
import { useLeaderboardUpsert } from '../hooks/useLeaderboardUpsert';

export type CellColor = string | null;

function DailySnooChallengePage() {
  // TODO: change to false in production
  const [gameStarted, setGameStarted] = useState(true);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [hasInitialPenaltyApplied, setHasInitialPenaltyApplied] = useState(false);

  const { setCurrentPage } = useContext(ApplicationContext);
  const { playPingSound } = useSound();
  const { upsertLeaderboard, isUpsertLoading, upsertError } = useLeaderboardUpsert();

  // Use custom hooks for game data and validation
  const { gameData, isLoading, error } = useGameData();
  const { validationResult, showCompletionMessage, validateGameState, resetValidation } =
    useGameValidation({
      gridSize: gameData.gridSize,
      cellColors: gameData.cellColors,
    });

  // Calculate total seconds from timer state
  const getTotalSeconds = useCallback(() => {
    return currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds;
  }, [currentTime]);

  // Handle time updates from GameTimer
  const handleTimeUpdate = useCallback(
    (time: { hours: number; minutes: number; seconds: number }) => {
      setCurrentTime(time);
    },
    []
  );

  // Apply initial penalty when game starts
  useEffect(() => {
    if (
      gameStarted &&
      !gameData.alreadySolved &&
      gameData.gridSize > 0 &&
      !hasInitialPenaltyApplied &&
      !isLoading &&
      !error
    ) {
      console.log('🔥 Game started - applying initial penalty of -5 points');
      setGameStartTime(Date.now());
      setHasInitialPenaltyApplied(true);

      void upsertLeaderboard({
        timeTaken: 0,
        score: -5,
      });
    }
  }, [
    gameStarted,
    gameData.alreadySolved,
    gameData.gridSize,
    hasInitialPenaltyApplied,
    isLoading,
    error,
    upsertLeaderboard,
  ]);

  // Handle game completion
  useEffect(() => {
    if (showCompletionMessage && validationResult?.completionMessage && gameStartTime) {
      const totalSeconds = getTotalSeconds();
      console.log('🎉 Game completed! Total time:', totalSeconds, 'seconds');
      console.log('🎯 Applying completion bonus of +15 points (net +10 after initial -5)');

      void upsertLeaderboard({
        timeTaken: totalSeconds,
        score: 15, // +15 to balance the initial -5, resulting in net +10
      });
    }
  }, [
    showCompletionMessage,
    validationResult?.completionMessage,
    gameStartTime,
    getTotalSeconds,
    upsertLeaderboard,
  ]);

  // Handle give up action
  const handleGiveUp = useCallback(() => {
    console.log('😞 Player gave up - no additional penalty needed (already applied -5 at start)');
    setCurrentPage('home');
  }, [setCurrentPage]);

  return (
    <div className="h-full w-full relative text-gray-800 p-10 px-4 2xs:px-0 flex justify-center items-center overflow-clip polka-dot-dark">
      <GameOptionsHeader
        showHomeButton={true}
        onHomeButtonClick={() => {
          if (!error && gameStarted) {
            setShowGiveUpModal(true);
          } else {
            setCurrentPage('home');
          }
        }}
      />
      {error && showGiveUpModal && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-bold bg-game-cream">Giving Up Today's Challenge?</div>
          <div className="flex gap-4 w-full max-w-2xs mx-auto">
            <GameButton
              onClick={() => setShowGiveUpModal(false)}
              text="No"
              className="bg-game-cream"
              disabled={isUpsertLoading}
            />
            <GameButton
              onClick={handleGiveUp}
              disabled={isUpsertLoading}
              text={isUpsertLoading ? 'Saving...' : 'Yes'}
              className="bg-game-red text-game-light"
            />
          </div>
          {upsertError && <div className="text-red-500 text-sm mt-2">Error: {upsertError}</div>}
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
          {/* Loading state */}
          {isLoading && <ApplicationLoadingPage />}

          {/* Error state */}
          {!isLoading && error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className="text-2xl font-bold text-game-dark bg-game-cream">
                Something went wrong
              </div>
              <GameButton
                onClick={() => {
                  setCurrentPage('home');
                }}
                text="Back to Home"
                className="bg-game-red"
              />
            </div>
          )}

          {/* Already solved state */}
          {!isLoading && !error && gameData.alreadySolved && (
            <div className="flex-1 w-full flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-600">Already Completed!</div>
              <div className="text-lg text-center mb-2">{gameData.message}</div>
              {gameData.timeRemaining && gameData.timeRemaining > 0 && (
                <div className="text-md text-gray-600 mb-4">
                  Next challenge in: {Math.floor(gameData.timeRemaining / 60)}m{' '}
                  {gameData.timeRemaining % 60}s
                </div>
              )}
              <GameButton onClick={() => setCurrentPage('home')} text="Back to Home" />
            </div>
          )}

          {/* Valid puzzle state */}
          {!isLoading && !error && !gameData.alreadySolved && gameData.gridSize > 0 && (
            <>
              {/* Timer */}
              <GameTimer
                isActive={gameStarted}
                gameCompleted={showCompletionMessage}
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Grid */}
              <GameGrid
                gridSize={gameData.gridSize}
                cellColors={gameData.cellColors}
                onCellClick={() => {
                  void playPingSound();
                }}
                validationResult={validationResult}
                onValidationRequest={validateGameState}
              />

              {/* Leaderboard Status */}
              {(isUpsertLoading || upsertError) && (
                <div className="fixed top-20 right-5 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  {isUpsertLoading && (
                    <div className="text-blue-600 text-sm">Saving progress...</div>
                  )}
                  {upsertError && (
                    <div className="text-red-600 text-sm">Save error: {upsertError}</div>
                  )}
                </div>
              )}

              {/* Game Completion Modal */}
              <GameCompletionModal
                isOpen={showCompletionMessage}
                completionMessage={validationResult?.completionMessage || ''}
                onPlayAgain={() => {
                  resetValidation();
                  // Reset game state for new attempt
                  setGameStartTime(null);
                  setCurrentTime({ hours: 0, minutes: 0, seconds: 0 });
                  setHasInitialPenaltyApplied(false);
                }}
                onBackToHome={() => setCurrentPage('home')}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DailySnooChallengePage;
