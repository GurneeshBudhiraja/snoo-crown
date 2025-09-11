import { useState, useEffect } from 'react';
import { CellColor } from '../components/CustomGridMaker';

type GameData = {
  gridSize: number;
  cellColors: CellColor[][];
  alreadySolved?: boolean;
  timeRemaining?: number;
  message?: string;
};

export function useGameData() {
  const [gameData, setGameData] = useState<GameData>({
    gridSize: 4,
    cellColors: Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null)),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getQuizOfTheDay() {
      try {
        setError(null);
        const response = await fetch('/api/post/get-quiz-otd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.success) {
          if (data.alreadySolved) {
            // User already solved this puzzle
            setGameData({
              gridSize: 0,
              cellColors: [],
              alreadySolved: true,
              timeRemaining: data.timeRemaining,
              message: data.message,
            });
          } else if (data.cellColors && data.gridSize) {
            // Valid puzzle data received
            setGameData({
              gridSize: data.gridSize,
              cellColors: data.cellColors,
              alreadySolved: false,
              timeRemaining: data.timeRemaining,
              message: data.message,
            });
          } else {
            throw new Error('Invalid puzzle data received from server');
          }
        } else {
          throw new Error(data.message || 'Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error in getQuizOfTheDay:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setGameData({
          gridSize: 0,
          cellColors: [],
          alreadySolved: false,
          message: 'Failed to load puzzle',
        });
      } finally {
        setIsLoading(false);
      }
    }

    void getQuizOfTheDay();
  }, []);

  return {
    gameData,
    isLoading,
    error,
  };
}
