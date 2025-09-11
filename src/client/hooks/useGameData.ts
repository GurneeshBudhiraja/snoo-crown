import { useState, useEffect } from 'react';
import { CellColor } from '../components/CustomGridMaker';

type GameData = {
  gridSize: number;
  cellColors: CellColor[][];
};

export function useGameData() {
  const [gameData, setGameData] = useState<GameData>({
    gridSize: 4,
    cellColors: Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null)),
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Gets the grid challenge info from the backend server
    try {
      setGameData({
        gridSize: 5,
        cellColors: [
          ['sky', 'sky', 'sky', 'bright-yellow', 'bright-yellow'],
          ['sky', 'sky', 'sky', 'bright-yellow', 'green'],
          ['sky', 'sky', 'sky', 'green', 'green'],
          ['peach', 'peach', 'peach', 'green', 'green'],
          ['red', 'red', 'red', 'red', 'red'],
        ],
      });
    } catch (error) {
      console.log('Error getting grid challenge info', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    gameData,
    isLoading,
  };
}
