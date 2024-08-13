import express from 'express';
import AuthController from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Register route
router.post('/register', (req, res) => AuthController.register(req, res));

// Login route
router.post('/login', (req, res, next) => AuthController.login(req, res, next));

// Get user route
router.get('/user', authenticate, (req, res) => AuthController.getUser(req, res));

export default router;
