import { redisClient } from '../infrastructure/cache/RedisClient';
import { incidentService } from '../services/IncidentService';

export class ThresholdWorker {
  private isRunning = false;

  public async start() {
    this.isRunning = true;
    console.log('[ThresholdWorker] Started background monitoring...');
    this.poll();
  }

  public stop() {
    this.isRunning = false;
    console.log('[ThresholdWorker] Stopped background monitoring.');
  }

  private async poll() {
    while (this.isRunning) {
      try {
        // Block for 2 seconds waiting for a metric from the right side of the list
        const result = await redisClient.brPop('watchtower:metrics_stream', 2);
        
        if (result) {
          const metric = JSON.parse(result.element);
          await this.evaluate(metric);
        }
      } catch (error) {
        console.error('[ThresholdWorker] Error polling metrics:', error);
        // Sleep briefly on error to prevent tight looping
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async evaluate(metric: any) {
    let breached = false;
    let reason = '';

    // Define simple hardcoded thresholds for the engine
    if (metric.metricType === 'CPU' && metric.value > 90) {
      breached = true;
      reason = `CPU exceeded 90% (Current: ${metric.value}%)`;
    } else if (metric.metricType === 'MEMORY' && metric.value > 85) {
      breached = true;
      reason = `Memory exceeded 85% (Current: ${metric.value}%)`;
    } else if (metric.metricType === 'ERROR_RATE' && metric.value > 5) {
      breached = true;
      reason = `Error rate exceeded 5% (Current: ${metric.value}%)`;
    } else if (metric.metricType === 'LATENCY' && metric.value > 1000) {
      breached = true;
      reason = `Latency exceeded 1000ms (Current: ${metric.value}ms)`;
    }

    if (breached) {
      console.log(`[ThresholdWorker] Threshold breached for service ${metric.serviceId}: ${reason}`);
      await incidentService.createIncident(`Automatic Incident: ${reason}`, { metric });
    }
  }
}

export const thresholdWorker = new ThresholdWorker();
