import express from 'express';
import healthRoutes from './api/rest/HealthRoutes';
import { errorHandler } from './api/rest/middlewares/errorHandler';
import { checkDbConnection } from './infrastructure/database/pgClient';
import { connectRedis } from './infrastructure/cache/RedisClient';
import { NotFoundError } from './api/rest/ApiErrors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/v1', healthRoutes);

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

  app.listen(PORT, () => {
    console.log(`🚀 Watchtower Server is running on http://localhost:${PORT}`);
  });
};

startServer();
