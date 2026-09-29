import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from '../src/middleware/authMiddleware';
import { UnauthorizedError } from '../src/errors/AppError';
import { Request, Response, NextFunction } from 'express';

describe('Authorization Middleware', () => {
  it('should block requests without an authorization header', () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => requireAuth(req, res, next)).toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
  });

  it('should block requests with an invalid token format', () => {
    const req = { headers: { authorization: 'Basic YWRtaW46YWRtaW4=' } } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    expect(() => requireAuth(req, res, next)).toThrow(UnauthorizedError);
    expect(next).not.toHaveBeenCalled();
  });

  it('should extract user context from a valid token and call next', () => {
    const req = { headers: { authorization: 'Bearer mock-jwt-token' } } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user?.id).toBe('u1');
    expect(req.user?.role).toBe('APPLICANT');
    expect(next).toHaveBeenCalledOnce();
  });
});
