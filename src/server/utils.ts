import { redis } from '@devvit/web/server';
import { redisKeys } from './constants';

export async function appendPostType(postId: string, postType: 'custom' | 'regular') {
  try {
    const response = await redis.get(redisKeys.postTypes);
    if (!response) {
      // If no post types are found, set the post type for the post
      await redis.set(redisKeys.postTypes, JSON.stringify({ [postId]: postType }));
    } else {
      // If post types are found, append the post type for the post
      const parsed = JSON.parse(response);
      parsed[postId] = postType;
      await redis.set(redisKeys.postTypes, JSON.stringify(parsed));
    }
    return true;
  } catch (error) {
    console.log('Error in `appendPostType`', (error as Error).message);
    return false;
  }
}

export async function getPostType(postId: string) {
  try {
    const response = await redis.get(redisKeys.postTypes);
    if (!response) {
      throw new Error(redisKeys.postTypes + 'not found in Redis');
    }
    const parsed = JSON.parse(response);
    const postType = parsed[postId];
    return {
      success: true,
      message: 'Post type fetched successfully',
      data: postType,
    };
  } catch (error) {
    console.log('Error in `getPostType`', error);
    return {
      success: false,
      message: 'Failed to get post type',
      data: [],
    };
  }
}

export function generateRandomGrid() {
  const AVAILABLE_GRID_SIZES = [4, 5, 6, 7];
  const AVAILABLE_CELL_COLORS = [
    'green',
    'sky',
    'peach',
    'bright-yellow',
    'pale-yellow',
    'pale-yellow',
    'gray',
  ];

  const gridSize = AVAILABLE_GRID_SIZES[Math.floor(Math.random() * AVAILABLE_GRID_SIZES.length)];

  const grid: (string | null)[][] = Array.from({ length: gridSize }).map(() =>
    Array.from({ length: gridSize }).map(
      () => AVAILABLE_CELL_COLORS[Math.floor(Math.random() * AVAILABLE_CELL_COLORS.length)] ?? null
    )
  );

  return {
    gridSize,
    cellColors: grid,
  };
}

export async function getQuizOfTheDay(userId: string) {
  try {
    // Gets the quiz of the day
    const response = await redis.get(redisKeys.quizOfTheDay);
    if (!response) {
      console.log('Creating a new quiz of the day');
      const { cellColors, gridSize } = generateRandomGrid();
      await redis.set(
        redisKeys.quizOfTheDay,
        JSON.stringify({
          quizGenerateTime: Date.now(),
          cellColors,
          gridSize,
        })
      );
      const response = await redis.get(redisKeys.quizOfTheDay);
      console.log('redisKeys.quizOfTheDay');
      console.log(response);
      if (!response) {
        throw new Error('Failed to generate quiz of the day');
      }
      const parsed = JSON.parse(response);
      await redis.set(redisKeys.usersSolvedQOTD, JSON.stringify([userId]));
      return {
        success: true,
        cellColors: parsed.cellColors,
        gridSize: parsed.gridSize,
        timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
        message: 'New quiz of the day generated',
        alreadySolved: false,
      };
    } else {
      const parsed = JSON.parse(response);
      // If the quiz has been generated more than 24 hours ago, delete the quiz and generate a new one
      // if (parsed.quizGenerateTime < Date.now() - 24 * 60 * 60 * 1000) {
      // TODO: Remove the below in prod and uncomment the above
      if (parsed.quizGenerateTime < Date.now() - 60 * 1000) {
        // Delete the quiz and the users who solved that quiz
        console.log('🗑️ Deleting the quiz of the day and the users who solved that quiz');
        await redis.del(redisKeys.quizOfTheDay);
        await redis.del(redisKeys.usersSolvedQOTD);
        return await getQuizOfTheDay(userId);
      }
      const usersSolvedQOTD = await redis.get(redisKeys.usersSolvedQOTD);
      if (!usersSolvedQOTD) {
        throw new Error('🚫 Failed to get users who solved the quiz of the day');
      }
      const parsedUsersSolvedQOTD = JSON.parse(usersSolvedQOTD);
      console.log('parsedUsersSolvedQOTD');
      console.log(parsedUsersSolvedQOTD);
      // Return if the user has already solved the quiz

      if (parsedUsersSolvedQOTD.includes(userId)) {
        console.log('The user has already solved this puzzle');
        return {
          success: true,
          alreadySolved: true,
          message: 'Already solved the quiz of the day',
          timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
        };
      }
      await redis.set(
        redisKeys.usersSolvedQOTD,
        JSON.stringify([...parsedUsersSolvedQOTD, userId])
      );
      return {
        success: true,
        ...parsed,
        alreadySolved: false,
        message: 'Quiz of the day fetched successfully',
        timeRemaining: Math.floor((parsed.quizGenerateTime + 60 * 1000 - Date.now()) / 1000),
      };
    }
  } catch (error) {
    console.log('Error in `getQuizOfTheDay`', error);
    return {
      success: false,
      alreadySolved: false,
      message: 'Failed to get quiz of the day',
      timeRemaining: 0,
      cellColors: [],
      gridSize: 0,
    };
  }
}
