

export class InvalidIncidentTransitionError extends Error {
  constructor(
    public readonly from: string,
    public readonly event: string
  ) {
    super(`Invalid transition from ${from} using event ${event}`);
  }
}