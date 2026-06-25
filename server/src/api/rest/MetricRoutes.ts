import { Router, Request, Response } from 'express';
import { WebSocketServer } from '../streaming/WebSocketServer';
import { redisClient } from '../../infrastructure/cache/RedisClient';
import { BadRequestError } from './ApiErrors';

const router = Router();

interface MetricPayload {
  serviceId: string;
  metricType: 'CPU' | 'MEMORY' | 'LATENCY' | 'ERROR_RATE';
  value: number;
  timestamp?: string;
}

router.post('/ingest', async (req: Request, res: Response) => {
  const metric: MetricPayload = req.body;

  // Basic Validation
  if (!metric.serviceId || !metric.metricType || metric.value === undefined) {
    throw new BadRequestError('Invalid metric payload. Required fields: serviceId, metricType, value.');
  }

  // Ensure timestamp exists
  const enrichedMetric = {
    ...metric,
    timestamp: metric.timestamp || new Date().toISOString(),
  };

  try {
    // 1. Push to Redis List (acts as a buffer for the processing workers)
    await redisClient.lPush('watchtower:metrics_stream', JSON.stringify(enrichedMetric));

    // 2. Keep the list trimmed to the last 10,000 metrics to save memory
    await redisClient.lTrim('watchtower:metrics_stream', 0, 9999);

    // 3. Broadcast to all connected WebSockets for real-time dashboards
    WebSocketServer.broadcastMetric(enrichedMetric);

    res.status(202).json({
      success: true,
      message: 'Metric ingested successfully',
      data: enrichedMetric
    });
  } catch (error) {
    console.error('Error ingesting metric:', error);
    throw new BadRequestError('Failed to process metric ingestion');
  }
});

export default router;
