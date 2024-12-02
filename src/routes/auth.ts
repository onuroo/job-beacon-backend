import { Router } from 'express';
import { createUser, loginUser, logoutUser, getUser } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getUser);

export default router; 