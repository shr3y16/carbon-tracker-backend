import express from 'express';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, (req: AuthRequest, res) => {
  res.json({ message: `Hello user ${req.userId}, here's your footprint data.` });
});

export default router;
