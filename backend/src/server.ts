import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import catalogRoutes from './routes/catalogRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import technicianRoutes from './routes/technicianRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { initSocketServer } from './socket';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

// Initialize Socket.IO server
initSocketServer(httpServer);

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zevota Backend API & WebSocket Server', timestamp: new Date().toISOString() });
});

// Mounting route groups
app.use('/api', catalogRoutes);
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', paymentRoutes);
app.use('/api', technicianRoutes);
app.use('/api', notificationRoutes);

// Error handling fallback
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err?.message });
});

httpServer.listen(port, () => {
  console.log(`🚀 Zevota REST API & WebSocket server running on http://localhost:${port}`);
});

export default app;
