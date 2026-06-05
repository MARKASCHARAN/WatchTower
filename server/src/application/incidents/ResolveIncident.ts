

import { IncidentEvent } from "../../domain/incident/IncidentEvent";
import { TransitionIncident } from "./TransitionIncident";

export class ResolveIncident {
  constructor(private readonly transitionIncident: TransitionIncident) {}

  async execute(incidentId: string) {
    return this.transitionIncident.execute(
      incidentId,
      IncidentEvent.RESOLVED
    );
  }
}
