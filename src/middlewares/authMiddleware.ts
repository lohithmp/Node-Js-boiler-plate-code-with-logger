import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/authValidation';
import { logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  logger.info('Received token:', token);

  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ error: 'Access denied' });
  }

  const decoded = verifyToken(token);
  logger.info('Decoded token:', decoded);

  if (!decoded) {
    logger.warn('Invalid token');
    return res.status(401).json({ error: 'Invalid token' });
  }

  (req as AuthenticatedRequest).user = decoded;

  next();
};
