

import { IncidentFSM } from "../../domain/incident/IncidentFSM";
import { IncidentEvent } from "../../domain/incident/IncidentEvent";
import { Incident } from "../../domain/incident/Incident";

export interface IncidentRepository {
  findById(id: string): Promise<Incident | null>;
  save(incident: Incident): Promise<void>;
}

export class TransitionIncident {
  constructor(private readonly incidentRepo: IncidentRepository) {}

  async execute(incidentId: string, event: IncidentEvent): Promise<Incident> {
    const incident = await this.incidentRepo.findById(incidentId);
    if (!incident) throw new Error("Incident not found");

    const nextState = IncidentFSM.transition(incident.state, event);
    incident.updateState(nextState);

    await this.incidentRepo.save(incident);
    return incident;
  }
}
