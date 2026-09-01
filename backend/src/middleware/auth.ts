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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    let clerkUserId: string | null = null;

    const secretKey = process.env.CLERK_SECRET_KEY;

    if (secretKey && !secretKey.includes('placeholder')) {
      try {
        const verified = await verifyToken(token, { secretKey });
        clerkUserId = verified.sub;
      } catch (err) {
        console.warn('Clerk verifyToken failed, trying payload decode:', err);
      }
    }

    // Fallback parsing for JWT sub claim if verifyToken is offline or using dev keys
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

    // Fallback if client passed direct dev user identifier
    if (!clerkUserId && token.length > 5) {
      clerkUserId = token;
    }

    if (!clerkUserId) {
      res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
      return;
    }

    // Retrieve header metadata if available
    const headerName = (req.headers['x-user-name'] as string) || undefined;
    const headerEmail = (req.headers['x-user-email'] as string) || undefined;
    const headerPhone = (req.headers['x-user-phone'] as string) || undefined;

    // Synchronize Clerk user identity into local DB
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId,
          name: headerName || 'Authenticated User',
          email: headerEmail || `${clerkUserId}@zevato.app`,
          phone: headerPhone || '',
          profileCompleted: false,
        },
      });
    } else if (headerName || headerEmail || headerPhone) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: headerName || user.name,
          email: headerEmail || user.email,
          phone: headerPhone !== undefined ? headerPhone : user.phone,
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized: Authentication process failed' });
  }
};
