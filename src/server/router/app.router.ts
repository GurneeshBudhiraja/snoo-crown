import { Router } from 'express';
import { clearLeaderboard, getLeaderboard, upsertLeaderboard } from '../controllers/app.controller';
import { context, reddit, redis } from '@devvit/web/server';
import { appendPostType, getPostType, getQuizOfTheDay } from '../utils';
import { redisKeys } from '../constants';
import { LeaderboardStats } from '../../shared/types/api';

const router = Router();

/**
 * Post related routes
 */

router.post('/post/create/custom', async (_req, res): Promise<void> => {
  try {
    // Todo: make checks whether the custom grid could be solved or not
    const post = await reddit.submitCustomPost({
      subredditName: context.subredditName,
      title: "Snoo's Crown",
      splash: {
        appDisplayName: "Snoo's Crown",
        backgroundUri: '',
        buttonLabel: "Welcome to Snoo's Crown",
        heading: "Snoo's Crown",
      },
    });

    const response = await appendPostType(post.id, 'custom');
    if (!response) {
      await reddit.remove(post.id, false);
      throw new Error('Failed to append post type');
    }
    console.log('new post id');
    console.log(post.id);
    res.json({
      success: true,
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      success: false,
      message: 'Failed to create custom post',
    });
  }
});

router.post('/post/get-post-type', async (_, res) => {
  try {
    const { postId } = context;
    if (!postId) {
      throw new Error('Failed to get the post id from context');
    }
    const postTypeResponse = await getPostType(postId);
    if (!postTypeResponse.success) {
      throw new Error(postTypeResponse.message);
    }
    res.status(200).json({
      success: postTypeResponse.success,
      data: postTypeResponse.data,
      message: postTypeResponse.message,
    });
  } catch (error) {
    console.log('Error getting post type', (error as Error).message);
    res.status(400).json({
      success: false,
      data: '',
      message: 'Failed to get post type',
    });
  }
});

// Gets the quiz of the day
router.post('/post/get-quiz-otd', async (_, res) => {
  try {
    // Gets the user id
    const userId = context.userId;
    if (!userId) {
      throw new Error('userId is required');
    }
    // TODO: verify whehter the user could get this quiz or already solved it
    const quizResponse = await getQuizOfTheDay(userId);
    res.status(200).json({
      success: true,
      ...quizResponse,
    });
  } catch (error) {
    console.log('Error getting quiz of the day', (error as Error).message);
    res.status(400).json({
      success: false,
      data: '',
      alreadySolved: false,
      message: 'Failed to get quiz of the day',
    });
  }
});

router.get('/get-qotd-info', async (_, res) => {
  try {
    const quizResponse = (await redis.get(redisKeys.quizOfTheDay)) as string;
    const usersRepsonse = (await redis.get(redisKeys.usersSolvedQOTD)) as string;
    res.status(200).json({
      success: true,
      ...JSON.parse(quizResponse),
      ...JSON.parse(usersRepsonse),
    });
  } catch (error) {
    console.log('Error getting quiz of the day info', (error as Error).message);
    res.status(400).json({
      success: false,
      data: '',
      message: 'Failed to get quiz of the day info',
    });
  }
});

/**
 * Leaderboard related routes
 */
router.get('/leaderboard', async (_req, res) => {
  try {
    console.log('Getting the leaderboard stats');
    const leaderboardResponse = await redis.get(redisKeys.dailyChallengeLeaderboard);
    console.log(leaderboardResponse);
    if (!leaderboardResponse) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No leaderboard stats found',
      });
    }
    const parsedLeaderboard = JSON.parse(leaderboardResponse) as LeaderboardStats[];
    const filteredLeaderboard = parsedLeaderboard.filter(
      (item: LeaderboardStats) =>
        item.subredditId === context.subredditId && item.postId === context.postId
    );
    res.status(200).json({
      success: true,
      data: filteredLeaderboard,
      currentUserId: context.userId,
      message: 'Leaderboard stats fetched successfully',
    });
  } catch (error) {
    console.log('Error getting leaderboard', (error as Error).message);
    res.status(400).json({
      success: false,
      data: [],
      message: 'Failed to get leaderboard',
    });
  }
});

router.post('/leaderboard/upsert', async (req, res) => {
  try {
    console.log('Raw request body:', req.body);
    console.log('Request body type:', typeof req.body);

    let parsedBody;
    if (typeof req.body === 'string') {
      parsedBody = JSON.parse(req.body);
    } else if (typeof req.body === 'object' && req.body !== null) {
      parsedBody = req.body;
    } else {
      throw new Error('Invalid request body format');
    }

    console.log('Parsed body:', parsedBody);
    const { timeTaken, score } = parsedBody as { timeTaken: number; score: number };

    if (typeof timeTaken !== 'number' || typeof score !== 'number') {
      console.log('❌ Invalid data types:', { timeTaken: typeof timeTaken, score: typeof score });
      return res.status(400).json({
        success: false,
        data: [],
        message: 'Time taken and score are required and must be numbers',
      });
    }

    console.log('✅ Valid leaderboard data received:', { timeTaken, score });

    // Gets the current user name
    const userName = await reddit.getCurrentUsername();
    const userId = context.userId;
    console.log('User info:', { userName, userId });

    if (!userName || !userId) {
      throw new Error('Failed to get the current user name and id');
    }
    // gets the current leaderboard stats
    const leaderboardResponse = await redis.get(redisKeys.dailyChallengeLeaderboard);
    if (!leaderboardResponse) {
      const newLeaderboard = [
        {
          userId,
          timeTaken,
          date: Date.now(),
          score,
          postId: context.postId || '',
          subredditId: context.subredditId,
          userName,
        },
      ] as LeaderboardStats[];
      await redis.set(redisKeys.dailyChallengeLeaderboard, JSON.stringify(newLeaderboard));
      console.log('🎯 New leaderboard created for first-time user');
      return res.status(200).json({
        success: true,
        data: newLeaderboard,
        message: 'Leaderboard upserted successfully',
      });
    } else {
      const parsedLeaderboard = JSON.parse(leaderboardResponse) as LeaderboardStats[];
      const existingUser = parsedLeaderboard.find(
        (item: LeaderboardStats) => item.userId === userId
      );
      if (existingUser) {
        existingUser.timeTaken = timeTaken;
        existingUser.score = existingUser.score + score;
      } else {
        parsedLeaderboard.push({
          userId,
          timeTaken,
          date: Date.now(),
          score,
          postId: context.postId || '',
          subredditId: context.subredditId,
          userName,
        });
      }

      const newLeaderboard = parsedLeaderboard as LeaderboardStats[];
      await redis.set(redisKeys.dailyChallengeLeaderboard, JSON.stringify(newLeaderboard));
      console.log('🎯 Leaderboard updated successfully for existing user');
      return res.status(200).json({
        success: true,
        data: newLeaderboard,
        message: 'Leaderboard upserted successfully',
      });
    }
  } catch (error) {
    console.log('Error upserting leaderboard', (error as Error).message);
    res.status(400).json({
      success: false,
      data: [],
      message: 'Failed to upsert leaderboard',
    });
  }
});

router.delete('/leaderboard', async (_, res) => {
  try {
    console.log('🚧 Deleting the leaderboard');
    await redis.del(redisKeys.dailyChallengeLeaderboard);
    res.status(200).json({
      success: true,
    });
    console.log('🎊 Leaderboard deleted successfully');
  } catch (error) {
    console.log('Error deletting the leaderboard', (error as Error).message);
    res.status(400).json({
      success: false,
    });
  }
});

export default router;
