import { AnimatePresence } from 'motion/react';
import { GameOptionsHeader, SnooLeaderboardImage, GameButton } from '../components';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardStats } from '../../shared/types/api';
import ApplicationLoadingPage from './ApplicationLoadingPage';

function LeaderboardPage() {
  const { leaderboardData, currentUserId, isLoading, error, refetch, deleteLeaderboard } =
    useLeaderboard();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full relative text-gray-800 p-4 flex flex-col overflow-hidden polka-dot-dark">
      <GameOptionsHeader showHomeButton={true} />

      <AnimatePresence>
        <SnooLeaderboardImage />
      </AnimatePresence>

      <div className="flex-1 w-full flex flex-col overflow-y-auto gap-4 p-4 sm:p-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <ApplicationLoadingPage />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-bold text-red-600">Error</div>
            <div className="text-lg text-center text-gray-600">{error}</div>
            <GameButton onClick={refetch} text="Try Again" />
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !error && leaderboardData.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-bold text-gray-600">No Data Available</div>
            <div className="text-lg text-center text-gray-500">
              Be the first to complete today's challenge!
            </div>
            <GameButton onClick={refetch} text="Refresh" />
          </div>
        )}

        {/* Leaderboard Data */}
        {!isLoading && !error && leaderboardData.length > 0 && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
                <h2 className="text-2xl font-bold text-white text-center">
                  Daily Challenge Leaderboard
                </h2>
                <div
                  onClick={() => {
                    console.log('🗑️ Deleting the leaderboard');
                    void deleteLeaderboard();
                  }}
                >
                  Click to clear the leaderboard
                </div>
                <p className="text-white/90 text-center mt-1">
                  {leaderboardData.length} player{leaderboardData.length !== 1 ? 's' : ''} completed
                  today's challenge
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {leaderboardData
                    .sort((a, b) => a.timeTaken - b.timeTaken) // Sort by fastest time
                    .map((player, index) => (
                      <div
                        key={`${player.userId}-${player.date}`}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          player.userId === currentUserId
                            ? 'bg-blue-50 border-blue-300 shadow-md'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? 'bg-yellow-500 text-white'
                                : index === 1
                                  ? 'bg-gray-400 text-white'
                                  : index === 2
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-300 text-gray-700'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">
                              {player.userName || 'Anonymous'}
                              {player.userId === currentUserId && (
                                <span className="text-blue-600 text-sm ml-2">(You)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              Completed on {formatDate(player.date)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg text-green-600">
                            {formatTime(player.timeTaken)}
                          </div>
                          <div className="text-sm text-gray-500">Score: {player.score}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
