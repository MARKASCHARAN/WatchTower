import { env } from '../config/env';

export class LLMClient {
  public async analyzeIncident(title: string, context: any): Promise<string> {
    console.log(`[LLMClient] Analyzing incident: ${title}`);

    // If an API key is provided, we would make a real request (e.g., OpenAI or Gemini).
    // For now, we simulate an AI analyzing the context.
    const prompt = `Analyze the following incident telemetry and suggest a root cause:
Title: ${title}
Context: ${JSON.stringify(context)}`;

    if (env.OPENAI_API_KEY) {
      // return this.callRealLLM(prompt);
      console.log('[LLMClient] Using real LLM endpoint (simulated bypass due to key)');
    }

    // Fallback/Mock AI analysis response for development
    return this.generateMockAnalysis(context);
  }

  private async generateMockAnalysis(context: any): Promise<string> {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (context?.metric?.metricType === 'CPU') {
      return 'AI Analysis: High CPU utilization detected. Potential root causes include a runaway process, an infinite loop in a recent deployment, or a sudden surge in traffic. Recommended action: Check recent application logs and scale out the service if traffic is organic.';
    }

    if (context?.metric?.metricType === 'MEMORY') {
      return 'AI Analysis: High memory usage detected. Potential root causes include a memory leak in the application code, or caching too much data in memory without eviction policies. Recommended action: Review heap dumps and restart the service if critical.';
    }

    return 'AI Analysis: Anomalous behavior detected. Please review the system logs and recent deployment history to identify the root cause.';
  }
}

export const llmClient = new LLMClient();
