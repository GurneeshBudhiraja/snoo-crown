import { AnimatePresence } from 'motion/react';
import { GameOptionsHeader, SnooLeaderboardImage, GameButton } from '../components';
import { useLeaderboard } from '../hooks/useLeaderboard';
import ApplicationLoadingPage from './ApplicationLoadingPage';
import { useContext } from 'react';
import { ApplicationContext } from '../context/context';
import { cn } from '../util';
import { Crown1, Crown2, Crown3 } from '../assets/assets';
import { Delete } from 'lucide-react';

function LeaderboardPage() {
  const {
    leaderboardData,
    currentUserId,
    isLoading,
    error,
    deleteLeaderboard: _deleteLeaderboard,
  } = useLeaderboard();
  const { setCurrentPage } = useContext(ApplicationContext);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'fixed inset-0 flex flex-col bg-game-cream p-0 m-0 z-10 rounded-lg polka-dot-dark overflow-hidden'
      )}
    >
      <GameOptionsHeader showHomeButton={true} className={cn(isLoading && 'z-50')} />

      <AnimatePresence>
        <SnooLeaderboardImage />
      </AnimatePresence>
      {/* Loading State */}
      {isLoading && <ApplicationLoadingPage />}

      {/* Error State */}
      {!isLoading && error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-2xl font-bold text-game-dark bg-game-cream">
            Something went wrong
          </div>
          <GameButton
            onClick={() => {
              setCurrentPage('home');
            }}
            text="Back to Home"
            className="bg-game-green"
          />
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !error && leaderboardData.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-2xl font-bold text-game-dark bg-game-cream">
            No Leaderboard Data Available
          </div>
          <GameButton
            onClick={() => {
              setCurrentPage('home');
            }}
            text="Back to Home"
            className="bg-game-green"
          />
        </div>
      )}

      {/* Leaderboard Data */}
      {!isLoading && !error && leaderboardData.length > 0 && (
        <div className="flex-1 w-full flex flex-col items-center gap-4 p-4 sm:p-8 min-h-0 font-game">
          <div className="text-center p-2 rounded-md game-button-border text-2xl xs:text-3xl font-bold text-game-black bg-game-pale-yellow font-game-ibm tracking-wide mt-4 flex-shrink-0">
            {/* NOTE: FOR DEVELOPMENT ONLY */}
            {/* <div
              className="absolute top-0 right-0 bg-red-600 p-2 rounded-md"
              onClick={() => {
                void _deleteLeaderboard();
              }}
            >
              <Delete />
            </div> */}
            Leaderboard
          </div>
          <div className="w-full max-w-sm mx-auto flex-1 min-h-0 z-10 scrollable-stable">
            <div className="space-y-4 overflow-y-auto max-h-[88%] 2xs:max-h-full focus:outline-none">
              {leaderboardData
                // Sort by the fastest time
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={`${player.userId}-${player.date}`}
                    className={cn(
                      'flex items-center justify-between p-3 border-4 rounded-md transition-all overflow-auto bg-game-light relative',
                      index === 0
                        ? 'border-game-bright-yellow shadow-game-dark/50 shadow-sm'
                        : 'border-black ',
                      { 'bg-game-sky': player.userId === currentUserId }
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 aspect-square game-button-border flex items-center justify-center font-bold font-game text-sm ${
                          index === 0
                            ? 'bg-game-bright-yellow text-game-dark'
                            : index === 1
                              ? 'bg-game-gray text-game-dark'
                              : index === 2
                                ? 'bg-yellow-600 text-game-dark'
                                : 'bg-game-light text-game-dark'
                        }`}
                      >
                        {index < 3 ? (
                          <img
                            src={index === 0 ? Crown1 : index === 1 ? Crown2 : Crown3}
                            alt="Crown"
                            className="aspect-square"
                          />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-game-dark font-game-ibm">
                          {player.userName || 'Anonymous'}
                          {player.userId === currentUserId && (
                            <span className=" text-sm ml-1 text-game-light font-game">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={cn(
                          'font-bold text-lg  2xs:text-xl text-game-orange font-game',
                          player.userId === currentUserId && 'text-game-light'
                        )}
                      >
                        {player.score}
                      </div>
                      <div className={cn('text-xs text-game-dark tracking-wide')}>
                        Time: {formatTime(player.timeTaken)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
