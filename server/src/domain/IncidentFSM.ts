export enum IncidentState {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  IDENTIFIED = 'IDENTIFIED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class IncidentFSM {
  private static validTransitions: Record<IncidentState, IncidentState[]> = {
    [IncidentState.OPEN]: [IncidentState.INVESTIGATING, IncidentState.CLOSED],
    [IncidentState.INVESTIGATING]: [IncidentState.IDENTIFIED, IncidentState.RESOLVED],
    [IncidentState.IDENTIFIED]: [IncidentState.RESOLVED],
    [IncidentState.RESOLVED]: [IncidentState.CLOSED, IncidentState.INVESTIGATING], // Can reopen if broken again
    [IncidentState.CLOSED]: [], // Terminal state
  };

  public static canTransition(currentState: IncidentState, nextState: IncidentState): boolean {
    const allowed = this.validTransitions[currentState];
    return allowed ? allowed.includes(nextState) : false;
  }

  public static transition(currentState: IncidentState, nextState: IncidentState): IncidentState {
    if (!this.canTransition(currentState, nextState)) {
      throw new Error(`Invalid state transition from ${currentState} to ${nextState}`);
    }
    return nextState;
  }
}
