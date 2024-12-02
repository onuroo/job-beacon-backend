import { Router } from 'express';
import { createCV, updateCV, getCandidateCV } from '../controllers/cv';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// CV oluşturma route'u
router.post('/', authMiddleware, createCV);

// CV güncelleme route'u
router.put('/:id', authMiddleware, updateCV);

// Adayın kendi CV'sini getirme route'u
router.get('/me', authMiddleware, getCandidateCV);

export default router; 