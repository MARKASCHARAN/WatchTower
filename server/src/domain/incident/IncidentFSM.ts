

import { IncidentState } from "./IncidentState";
import { IncidentEvent } from "./IncidentEvent";
import { InvalidIncidentTransitionError } from "./IncidentErrors";

const TRANSITIONS: Record<
  IncidentState,
  Partial<Record<IncidentEvent, IncidentState>>
> = {
  [IncidentState.OPEN]: {
    [IncidentEvent.ACKNOWLEDGED]: IncidentState.INVESTIGATING,
  },

  [IncidentState.INVESTIGATING]: {
    [IncidentEvent.MITIGATION_APPLIED]: IncidentState.MITIGATED,
  },

  [IncidentState.MITIGATED]: {
    [IncidentEvent.RESOLVED]: IncidentState.RESOLVED,
  },

  [IncidentState.RESOLVED]: {},
};

export class IncidentFSM {
  static transition(
    current: IncidentState,
    event: IncidentEvent
  ): IncidentState {
    const next = TRANSITIONS[current]?.[event];

    if (!next) {
      throw new InvalidIncidentTransitionError(current, event);
    }

    return next;
  }
}
