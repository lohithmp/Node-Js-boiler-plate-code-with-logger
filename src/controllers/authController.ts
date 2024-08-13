import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import { JwtPayload } from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      logger.info(`Registering user: ${username}`);

      const result = await AuthService.register(username, password);

      if ('error' in result) {
        logger.error(`Registration failed for user: ${username}`);
        res.status(400).json(result);
      } else {
        logger.info(`User registered successfully: ${username}`);
        res.status(201).json(result);
      }
    } catch (error) {
      logger.error('Internal server error during registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      logger.info(`User login attempt: ${username}`);
      const result = await AuthService.login(username, password);

      if ('error' in result) {
        logger.warn(`Login failed for user: ${username}`);
        res.status(401).json(result);
      } else {
        logger.info(`User logged in successfully: ${username}`);
        res.status(200).json({ token: result.token });
        (req as AuthRequest).user = result.user;
        next();
      }
    } catch (error) {
      logger.error('Internal server error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {

      const userId = (req.user as JwtPayload)?.id;
      logger.info(`Fetching user details for ID: ${userId}`);
      if (!userId) {
        logger.warn('Unauthorized access attempt');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const result = await AuthService.getUserById(userId.toString());

      if ('error' in result) {
        logger.warn(`User not found: ID ${userId}`);
        res.status(404).json({ error: 'User not found' });
        return;
      } else  {
        logger.info(`User details retrieved: ID ${userId}`);
        res.status(200).json(result);
      }
    } catch (error) {
      logger.error('Internal server error during user retrieval:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new AuthController();
