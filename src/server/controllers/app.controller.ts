import { context, reddit, redis } from '@devvit/web/server';
import { Request, Response } from 'express';
import { LeaderboardStats } from '../../shared/types/api';

export async function getLeaderboard(_req: Request, res: Response) {
  try {
    // Get the post and subreddit IDs from the context
    const { postId, subredditId } = context;

    // Verify that the post and subreddit IDs are present
    if (!postId || !subredditId) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Missing post/subreddit context',
      });
    }
    // Get the leaderboard data from the Redis database
    const raw = await redis.get('leaderboard');

    if (!raw) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No leaderboard stats found',
      });
    }

    const parsed: LeaderboardStats[] = JSON.parse(raw);

    const filtered = parsed.filter(
      (stat) => stat.subredditId === subredditId && stat.postId === postId
    );

    return res.status(200).json({
      success: true,
      data: filtered,
      message: 'Leaderboard stats fetched successfully',
    });
  } catch (error) {
    console.log('🚨 Error in getLeaderboard', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      data: [],
    });
  }
}

export async function clearLeaderboard() {
  try {
    await redis.del('leaderboard');
    return {
      success: true,
      message: 'Leaderboard cleared successfully',
      data: [],
    };
  } catch (error) {
    console.log('🚨 Error in clearLeaderboard', error);
    return {
      success: false,
      message: 'Error clearing leaderboard',
      data: [],
    };
  }
}

export async function upsertLeaderboard(score: number) {
  try {
    const raw = await redis.get('leaderboard');

    // Read request-scoped values inside the handler
    const { userId, postId, subredditId } = context;
    const userName = await reddit.getCurrentUsername();

    if (!userId || !userName) {
      throw new Error('userId and userName are required');
    }
    if (!postId || !subredditId) {
      throw new Error('postId and subredditId are required');
    }

    const item: LeaderboardStats = {
      userId,
      userName,
      score,
      date: Date.now(),
      postId,
      subredditId,
    };

    if (raw) {
      const list: LeaderboardStats[] = JSON.parse(raw);
      list.push(item);
      await redis.set('leaderboard', JSON.stringify(list));
    } else {
      await redis.set('leaderboard', JSON.stringify([item]));
    }

    return {
      success: true,
      message: 'Leaderboard upserted successfully',
      data: [],
    };
  } catch (error) {
    console.log('🚨 Error in upsertLeaderboard', error);
    return {
      success: false,
      message: 'Error upserting leaderboard',
      data: [],
    };
  }
}
