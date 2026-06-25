import express from 'express';
import http from 'http';
import { WebSocketServer } from './api/streaming/WebSocketServer';
import healthRoutes from './api/rest/HealthRoutes';
import incidentRoutes from './api/rest/IncidentRoutes';
import metricRoutes from './api/rest/MetricRoutes';
import { errorHandler } from './api/rest/middlewares/errorHandler';
import { checkDbConnection } from './infrastructure/database/pgClient';
import { connectRedis } from './infrastructure/cache/RedisClient';
import { thresholdWorker } from './workers/ThresholdWorker';
import { NotFoundError } from './api/rest/ApiErrors';

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/metrics', metricRoutes);

// Catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const startServer = async () => {
  await checkDbConnection();
  await connectRedis();

  // Initialize WebSocket server
  WebSocketServer.initialize(httpServer);

  // Start background workers
  thresholdWorker.start();

  httpServer.listen(PORT, () => {
    console.log(`Watchtower Server is running on http://localhost:${PORT}`);
  });
};

startServer();
