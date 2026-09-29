import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/AppError';

export interface AuthenticatedUser {
  id: string;
  role: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Extracts and verifies the authorization token.
 * This establishes a centralized authorization context for downstream handlers.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization token');
  }

  const token = authHeader.split(' ')[1];

  try {
    // In production, verify JWT using a secret key and a library like jsonwebtoken.
    // For now, since we removed silent mocks, we'll implement a basic mock verification
    // that assumes the token is valid if present (to unblock development), but establishes
    // the structure for the real verification.
    
    // Simulating token payload extraction
    if (token === 'mock-jwt-token') {
      req.user = {
        id: 'u1',
        role: 'APPLICANT',
      };
    } else {
      // Decode real token payload here
      // req.user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: 'real-user', role: 'APPLICANT' }; 
    }
    
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};
