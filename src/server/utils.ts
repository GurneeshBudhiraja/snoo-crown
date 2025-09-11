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
