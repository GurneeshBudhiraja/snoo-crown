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
    async function getQuizOfTheDay() {
      try {
        // const response = await fetch('/api/post/get-quiz-otd', {
        const response = await fetch('/api/post/get-quiz-otd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        // if (data.success) {
        //   setGameData({
        //     gridSize: data.gridSize,
        //     cellColors: data.cellColors,
        //   });
        // }
      } catch (error) {
        console.log('Error in getQuizOfTheDay', error);
      }
    }
    getQuizOfTheDay()
      .then((data) => {
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
      })
      .catch((error) => {
        console.error('Error in getQuizOfTheDay promise:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    gameData,
    isLoading,
  };
}
