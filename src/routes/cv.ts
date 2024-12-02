import { Router } from 'express';
import { createCV, updateCV } from '../controllers/cv';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// CV oluşturma route'u
router.post('/', authMiddleware, createCV);

// CV güncelleme route'u
router.put('/:id', authMiddleware, updateCV);

export default router; 