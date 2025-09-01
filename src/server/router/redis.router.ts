import { redis } from '@devvit/web/server';
import { Router } from 'express';
import { USER_POST_KEY_SUFFIX } from '../../shared/shared-constants';

const router = Router();

router.get('/', async (_req, res): Promise<void> => {
  try {
    const { key } = _req.query;
    const response = await redis.get(key as string);
    res.status(200).json({
      status: 'success',
      data: response ? JSON.parse(response) : [],
    });
  } catch (error) {
    console.error(`Error getting redis key: ${error}`);
    res.status(400).json({
      status: 'error',
      data: 'Failed to get redis key',
    });
  }
});

router.delete('/', async (req, res): Promise<void> => {
  try {
    const { key } = req.query;
    await redis.del(`${USER_POST_KEY_SUFFIX}:${key}`);
    res.status(200).json({
      status: 'success',
      data: 'Redis key deleted',
    });
  } catch (error) {
    console.error(`Error getting redis key: ${error}`);
    res.status(400).json({
      status: 'error',
      data: 'Failed to get redis key',
    });
  }
});

export default router;
