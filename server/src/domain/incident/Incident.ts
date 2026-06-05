import { IncidentState } from "./IncidentState";

export interface IncidentProps {
  id: string;
  service: string;
  summary: string;
  state: IncidentState;
  createdAt: Date;
  updatedAt: Date;
}

export class Incident {
  private props: IncidentProps;

  constructor(props: IncidentProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get state() {
    return this.props.state;
  }

  updateState(newState: IncidentState) {
    this.props.state = newState;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
