import { Router } from 'express';
import { clearLeaderboard, getLeaderboard, upsertLeaderboard } from '../controllers/app.controller';

const router = Router();

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

export default router;
