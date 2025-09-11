import { Router } from 'express';
import { createPost } from '../core/post';
import { context, reddit } from '@devvit/web/server';
import { appendPostType, getPostType } from '../utils';

const router = Router();

router.post('/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();
    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

// This is used to create a regular post
router.post('/menu/post-create', async (_req, res): Promise<void> => {
  try {
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
    const response = await appendPostType(post.id, 'regular');
    if (!response) {
      await reddit.remove(post.id, false);
      throw new Error('Failed to append post type');
    }
    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${(error as Error).message}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

export default router;
