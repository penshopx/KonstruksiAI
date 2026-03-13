import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
);

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Generate a JWT token for authenticated users
 */
export async function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const jwtPayload = payload as unknown as JWTPayload;

    // Validate required fields
    if (!jwtPayload.userId || !jwtPayload.email || !jwtPayload.role) {
      throw new AuthError('Invalid token payload', 401);
    }

    return jwtPayload;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Invalid or expired token', 401);
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Middleware function for protecting API routes
 */
export async function authenticateRequest(request: NextRequest): Promise<JWTPayload> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AuthError('No authentication token provided', 401);
    }

    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Authentication failed', 401);
  }
}

/**
 * Check if user has required role(s)
 */
export function hasRole(userRole: string, requiredRoles: string | string[]): boolean {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
}

/**
 * Higher-order function to create protected route handlers
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse> | NextResponse,
  options: {
    requiredRoles?: string | string[];
    allowPublic?: boolean;
  } = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const user = await authenticateRequest(request);

      // Check role-based access if required
      if (options.requiredRoles && !hasRole(user.role, options.requiredRoles)) {
        return NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
          { status: 403 }
        );
      }

      return await handler(request, user, ...args);
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: error.statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN',
              message: error.message
            }
          },
          { status: error.statusCode }
        );
      }

      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Authentication service error' } },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility function to get current user from request
 */
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    return await authenticateRequest(request);
  } catch {
    return null;
  }
}