import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validateLogin } from '../middleware/validate.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', validateLogin, login);

export default router;
