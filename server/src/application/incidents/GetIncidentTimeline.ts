

export interface IncidentEventLog {
  state: string;
  timestamp: Date;
}

export interface IncidentTimelineRepository {
  getTimeline(incidentId: string): Promise<IncidentEventLog[]>;
}

export class GetIncidentTimeline {
  constructor(
    private readonly timelineRepo: IncidentTimelineRepository
  ) {}

  async execute(incidentId: string) {
    return this.timelineRepo.getTimeline(incidentId);
  }
}
