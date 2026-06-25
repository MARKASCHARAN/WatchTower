import { IncidentState, IncidentFSM } from '../domain/IncidentFSM';
import { llmClient } from '../ai/LLMClient';
import { pgPool } from '../infrastructure/database/pgClient';

export interface Incident {
  id: string;
  title: string;
  state: IncidentState;
  context?: any;
  ai_analysis?: string;
}

class IncidentService {
  public async createIncident(title: string, context?: any): Promise<Incident> {
    const id = `INC-${Date.now()}`;
    const state = IncidentState.OPEN;
    
    // Insert into DB first
    await pgPool.query(
      'INSERT INTO incidents (id, title, state, context) VALUES ($1, $2, $3, $4)',
      [id, title, state, JSON.stringify(context || {})]
    );

    const newIncident: Incident = { id, title, state, context };
    console.log(`[IncidentService] Created new incident: ${id} - ${title}`);

    // Trigger AI Copilot analysis asynchronously
    llmClient.analyzeIncident(title, context)
      .then(async (analysis) => {
        await pgPool.query('UPDATE incidents SET ai_analysis = $1 WHERE id = $2', [analysis, id]);
        console.log(`[IncidentService] AI Analysis completed for ${id}`);
      })
      .catch((err) => {
        console.error(`[IncidentService] AI Analysis failed for ${id}:`, err);
      });

    return newIncident;
  }

  public async updateIncidentState(id: string, nextState: IncidentState): Promise<Incident> {
    // 1. Fetch current state to validate FSM
    const { rows } = await pgPool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    const incident = rows[0];
    
    if (!incident) {
      throw new Error(`Incident ${id} not found`);
    }

    // 2. Validate Transition
    const validatedState = IncidentFSM.transition(incident.state as IncidentState, nextState);

    // 3. Update DB
    await pgPool.query(
      'UPDATE incidents SET state = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [validatedState, id]
    );

    incident.state = validatedState;
    console.log(`[IncidentService] Incident ${id} transitioned to ${validatedState}`);
    
    return incident;
  }

  public async getIncident(id: string): Promise<Incident | undefined> {
    const { rows } = await pgPool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    return rows[0];
  }
}

export const incidentService = new IncidentService();
