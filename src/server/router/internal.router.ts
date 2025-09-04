import { Router } from 'express';
import { createPost } from '../core/post';
import { context, reddit } from '@devvit/web/server';

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

router.post('/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await reddit.submitCustomPost({
      subredditName: context.subredditName!,
      title: 'My Interactive Post',
      splash: {
        appDisplayName: "Snoo's Crown",
        backgroundUri: 'splash-background.jpeg',
        buttonLabel: "Let's Go!",
        entry: 'src/client/index.html',
        description: "Snoo's Crown",
        heading: 'Welcome to the Game!',
      },
      postData: {
        gameState: 'initial',
        score: 0,
      },
    });

    // const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

export default router;
