import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import catalogRoutes from './routes/catalogRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Zevota Backend API', timestamp: new Date().toISOString() });
});

// Mounting route groups: Catalog routes are public, user & booking routes use route-level auth
app.use('/api', catalogRoutes);
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);

// Error handling fallback
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err?.message });
});

app.listen(port, () => {
  console.log(`🚀 Zevota REST API server running on http://localhost:${port}`);
});

export default app;
