import { Router, Request, Response } from 'express';
import { IncidentState, IncidentFSM } from '../../domain/IncidentFSM';
import { BadRequestError } from './ApiErrors';

const router = Router();

// In-memory mock DB for incidents until we wire up PostgreSQL queries
const mockIncidents: Record<string, { id: string; title: string; state: IncidentState }> = {};
let idCounter = 1;

// Create a new incident
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    throw new BadRequestError('Incident title is required');
  }

  const newIncident = {
    id: `INC-${idCounter++}`,
    title,
    state: IncidentState.OPEN
  };

  mockIncidents[newIncident.id] = newIncident;

  res.status(201).json({
    success: true,
    data: newIncident
  });
});

// Update incident state
router.patch('/:id/state', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { nextState } = req.body as { nextState: IncidentState };

  const incident = mockIncidents[id];
  if (!incident) {
    throw new BadRequestError(`Incident ${id} not found`);
  }

  try {
    // Attempt FSM Transition
    incident.state = IncidentFSM.transition(incident.state, nextState);
    
    res.status(200).json({
      success: true,
      data: incident
    });
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
});

export default router;
