import { Router } from 'express';
import { clearLeaderboard, getLeaderboard, upsertLeaderboard } from '../controllers/app.controller';
import { context, reddit } from '@devvit/web/server';
import { appendPostType, getPostType } from '../utils';

const router = Router();

/**
 * Leaderboard related routes
 */
// Gets all the leaderboard stats
router.get('/leaderboard', async (_req, res) => getLeaderboard(_req, res));

// Upserts a leaderboard stat
router.post('/leaderboard', async (req, res) => {
  const { score } = JSON.parse(req.body) as { score: number };
  if (!score || typeof score !== 'number') {
    return res
      .status(400)
      .json({ success: false, message: 'Score is required and must be a number' });
  }
  const response = await upsertLeaderboard(Number(score));
  if (!response.success) {
    return res.status(400).json(response);
  }
});

// Delete all the leaderboard stats
router.delete('/leaderboard', async (_, res) => {
  const response = await clearLeaderboard();
  if (!response.success) {
    return res.status(400).json(response);
  }
  return res.status(200).json(response);
});

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

export default router;
