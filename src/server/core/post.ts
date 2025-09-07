import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
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
  return customPost;
};
