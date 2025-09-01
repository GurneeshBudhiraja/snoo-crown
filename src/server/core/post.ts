import { context, reddit, redis } from '@devvit/web/server';
import { USER_POST_KEY_SUFFIX } from '../../shared/shared-constants';

export const createPost = async () => {
  const { subredditName, userId } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  const customPost = await reddit.submitCustomPost({
    splash: {
      appDisplayName: "Snoo's Crown",
    },
    subredditName: subredditName,
    title: "Snoo's Crown",
  });
  const { id } = customPost;
  const response = await redis.get(`${USER_POST_KEY_SUFFIX}:${userId}`);
  if (response) {
    const allPosts = JSON.parse(response) as string[];
    allPosts.push(id);
    await redis.set(`${USER_POST_KEY_SUFFIX}:${userId}`, JSON.stringify(allPosts));
  } else {
    await redis.set(`${USER_POST_KEY_SUFFIX}:${userId}`, JSON.stringify([id]));
  }
  return customPost;
};
