import { LLMClient } from '../../src/ai/LLMClient';
import { env } from '../../src/config/env';

describe('LLMClient', () => {
  let llmClient: LLMClient;

  beforeEach(() => {
    llmClient = new LLMClient();
    // Supress console logs in test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  it('should return a memory-specific analysis when metric is MEMORY', async () => {
    const context = { metric: { metricType: 'MEMORY', value: 95 } };
    const response = await llmClient.analyzeIncident('High Memory Usage', context);
    
    expect(response).toContain('High memory usage detected');
  });

  it('should return a CPU-specific analysis when metric is CPU', async () => {
    const context = { metric: { metricType: 'CPU', value: 99 } };
    const response = await llmClient.analyzeIncident('High CPU Usage', context);
    
    expect(response).toContain('High CPU utilization detected');
  });

  it('should return a generic anomaly analysis when metric type is unknown', async () => {
    const context = { metric: { metricType: 'LATENCY', value: 2000 } };
    const response = await llmClient.analyzeIncident('Slow Response Time', context);
    
    expect(response).toContain('Anomalous behavior detected');
  });
});
