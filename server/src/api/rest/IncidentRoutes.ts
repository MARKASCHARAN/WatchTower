import { Router, Request, Response } from 'express';
import { IncidentState } from '../../domain/IncidentFSM';
import { BadRequestError } from './ApiErrors';
import { incidentService } from '../../services/IncidentService';

const router = Router();

// Create a new incident
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    throw new BadRequestError('Incident title is required');
  }

  const newIncident = incidentService.createIncident(title);

  res.status(201).json({
    success: true,
    data: newIncident
  });
});

// Update incident state
router.patch('/:id/state', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { nextState } = req.body as { nextState: IncidentState };

  try {
    const updatedIncident = incidentService.updateIncidentState(id, nextState);
    
    res.status(200).json({
      success: true,
      data: updatedIncident
    });
  } catch (error: any) {
    throw new BadRequestError(error.message);
  }
});

export default router;
