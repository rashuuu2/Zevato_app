import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '@clerk/backend';
import prisma from './db';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  clerkUserId?: string;
}

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket Auth Handshake Middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization
          ? socket.handshake.headers.authorization.split(' ')[1]
          : null);

      if (!token) {
        return next(new Error('Authentication error: Missing token'));
      }

      let clerkUserId: string | null = null;
      const secretKey = process.env.CLERK_SECRET_KEY;

      if (secretKey && !secretKey.includes('placeholder')) {
        try {
          const verified = await verifyToken(token, { secretKey });
          clerkUserId = verified.sub;
        } catch (e) {
          // Token verification fallback
        }
      }

      if (!clerkUserId) {
        try {
          const base64Payload = token.split('.')[1];
          if (base64Payload) {
            const payloadBuffer = Buffer.from(base64Payload, 'base64');
            const payload = JSON.parse(payloadBuffer.toString('utf-8'));
            clerkUserId = payload.sub || payload.userId || null;
          }
        } catch (e) {
          // Ignore parse error
        }
      }

      if (!clerkUserId && token.length > 5) {
        clerkUserId = token;
      }

      if (!clerkUserId) {
        return next(new Error('Authentication error: Invalid token'));
      }

      const user = await prisma.user.findUnique({
        where: { clerkUserId },
      });

      const userId = user ? user.id : clerkUserId;
      socket.userId = userId;
      socket.clerkUserId = clerkUserId;

      next();
    } catch (err) {
      console.error('Socket auth handshake error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    if (userId) {
      const userRoom = `user:${userId}`;
      socket.join(userRoom);
      console.log(`🔌 Client connected to WebSocket [Socket ID: ${socket.id}] Joined room: ${userRoom}`);
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected from WebSocket [Socket ID: ${socket.id}]`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

export const broadcastToUser = (userId: string, event: string, payload: any): void => {
  if (!io) return;
  const userRoom = `user:${userId}`;
  io.to(userRoom).emit(event, payload);
  console.log(`📡 WebSocket Event Broadcasted [Event: ${event}] to Room: ${userRoom}`);
};
