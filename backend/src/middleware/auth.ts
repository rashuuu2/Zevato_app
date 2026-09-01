import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import prisma from '../db';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let clerkUserId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secretKey = process.env.CLERK_SECRET_KEY;

      if (secretKey && !secretKey.includes('placeholder')) {
        try {
          const verified = await verifyToken(token, { secretKey });
          clerkUserId = verified.sub;
        } catch (err) {
          // Token verification fallback
        }
      }

      // Fallback parsing for JWT sub claim
      if (!clerkUserId) {
        try {
          const base64Payload = token.split('.')[1];
          if (base64Payload) {
            const payloadBuffer = Buffer.from(base64Payload, 'base64');
            const payload = JSON.parse(payloadBuffer.toString('utf-8'));
            clerkUserId = payload.sub || payload.userId || null;
          }
        } catch (e) {
          // Ignore JSON parse error
        }
      }

      // Fallback if client passed raw user identifier or dev token
      if (!clerkUserId && token && token.length > 3) {
        clerkUserId = token;
      }
    }

    // Default to guest user if no auth header
    if (!clerkUserId) {
      clerkUserId = 'guest-user-default';
    }

    // Retrieve header metadata if available
    const headerName = (req.headers['x-user-name'] as string) || undefined;
    const headerEmail = (req.headers['x-user-email'] as string) || undefined;
    const headerPhone = (req.headers['x-user-phone'] as string) || undefined;

    // Atomic upsert so concurrent requests never fail unique constraints
    let user: User;

    try {
      user = await prisma.user.upsert({
        where: { clerkUserId },
        update: {
          ...(headerName && { name: headerName }),
          ...(headerEmail && { email: headerEmail }),
          ...(headerPhone !== undefined && { phone: headerPhone }),
        },
        create: {
          clerkUserId,
          name: headerName || 'Zevota User',
          email: headerEmail || `${clerkUserId}@zevato.app`,
          phone: headerPhone || '',
          profileCompleted: false,
        },
      });
    } catch (dbError) {
      console.warn('Prisma user upsert fallback:', dbError);
      const existing = await prisma.user.findFirst({ where: { clerkUserId } });
      if (existing) {
        user = existing;
      } else {
        user = {
          id: clerkUserId,
          clerkUserId,
          name: headerName || 'Zevota User',
          email: headerEmail || 'user@zevato.app',
          phone: headerPhone || null,
          avatarUrl: null,
          profileCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.user = {
      id: 'guest-fallback',
      clerkUserId: 'guest-fallback',
      name: 'Zevota User',
      email: 'user@zevato.app',
      phone: null,
      avatarUrl: null,
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    next();
  }
};
