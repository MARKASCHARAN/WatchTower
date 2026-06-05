

import { Incident } from "../../domain/incident/Incident";
import { IncidentState } from "../../domain/incident/IncidentState";

export interface CreateIncidentInput {
  id: string;
  service: string;
  summary: string;
}

export interface IncidentRepository {
  save(incident: Incident): Promise<void>;
}

export class CreateIncident {
  constructor(private readonly incidentRepo: IncidentRepository) {}

  async execute(input: CreateIncidentInput): Promise<Incident> {
    const incident = new Incident({
      id: input.id,
      service: input.service,
      summary: input.summary,
      state: IncidentState.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.incidentRepo.save(incident);

    return incident;
  }
}
