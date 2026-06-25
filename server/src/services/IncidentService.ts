import { IncidentState, IncidentFSM } from '../domain/IncidentFSM';
import { llmClient } from '../ai/LLMClient';

export interface Incident {
  id: string;
  title: string;
  state: IncidentState;
  context?: any;
  aiAnalysis?: string;
}

class IncidentService {
  private mockIncidents: Record<string, Incident> = {};
  private idCounter = 1;

  public createIncident(title: string, context?: any): Incident {
    const newIncident: Incident = {
      id: `INC-${this.idCounter++}`,
      title,
      state: IncidentState.OPEN,
      context
    };

    this.mockIncidents[newIncident.id] = newIncident;
    console.log(`[IncidentService] Created new incident: ${newIncident.id} - ${title}`);

    // Trigger AI Copilot analysis asynchronously
    llmClient.analyzeIncident(title, context)
      .then((analysis) => {
        newIncident.aiAnalysis = analysis;
        console.log(`[IncidentService] AI Analysis completed for ${newIncident.id}`);
        // Here we could also broadcast the update via WebSocket
      })
      .catch((err) => {
        console.error(`[IncidentService] AI Analysis failed for ${newIncident.id}:`, err);
      });

    return newIncident;
  }

  public updateIncidentState(id: string, nextState: IncidentState): Incident {
    const incident = this.mockIncidents[id];
    if (!incident) {
      throw new Error(`Incident ${id} not found`);
    }

    incident.state = IncidentFSM.transition(incident.state, nextState);
    console.log(`[IncidentService] Incident ${id} transitioned to ${nextState}`);
    return incident;
  }

  public getIncident(id: string): Incident | undefined {
    return this.mockIncidents[id];
  }
}

export const incidentService = new IncidentService();
