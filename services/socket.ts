import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL
  ? process.env.EXPO_PUBLIC_API_URL.replace('/api', '')
  : 'http://localhost:3000';

let socket: Socket | null = null;

export const initSocketClient = (token: string): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log(`⚡ Connected to Zevota WebSocket server [Socket ID: ${socket?.id}]`);
  });

  socket.on('connect_error', (err: any) => {
    console.warn('Socket connection error:', err?.message || err);
  });

  socket.on('disconnect', (reason: any) => {
    console.log(`🔌 Socket disconnected: ${reason}`);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
