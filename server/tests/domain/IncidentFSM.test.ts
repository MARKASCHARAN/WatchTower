import { IncidentState, IncidentFSM } from '../../src/domain/IncidentFSM';

describe('IncidentFSM', () => {
  describe('canTransition()', () => {
    it('should allow transition from OPEN to INVESTIGATING', () => {
      expect(IncidentFSM.canTransition(IncidentState.OPEN, IncidentState.INVESTIGATING)).toBe(true);
    });

    it('should allow transition from OPEN to CLOSED', () => {
      expect(IncidentFSM.canTransition(IncidentState.OPEN, IncidentState.CLOSED)).toBe(true);
    });

    it('should deny transition from OPEN directly to RESOLVED', () => {
      expect(IncidentFSM.canTransition(IncidentState.OPEN, IncidentState.RESOLVED)).toBe(false);
    });

    it('should allow transition from INVESTIGATING to IDENTIFIED', () => {
      expect(IncidentFSM.canTransition(IncidentState.INVESTIGATING, IncidentState.IDENTIFIED)).toBe(true);
    });

    it('should allow transition from IDENTIFIED to RESOLVED', () => {
      expect(IncidentFSM.canTransition(IncidentState.IDENTIFIED, IncidentState.RESOLVED)).toBe(true);
    });

    it('should deny transitioning out of CLOSED state (Terminal state)', () => {
      expect(IncidentFSM.canTransition(IncidentState.CLOSED, IncidentState.OPEN)).toBe(false);
      expect(IncidentFSM.canTransition(IncidentState.CLOSED, IncidentState.INVESTIGATING)).toBe(false);
    });
  });

  describe('transition()', () => {
    it('should return the next state if the transition is valid', () => {
      const nextState = IncidentFSM.transition(IncidentState.OPEN, IncidentState.INVESTIGATING);
      expect(nextState).toBe(IncidentState.INVESTIGATING);
    });

    it('should throw an error if the transition is invalid', () => {
      expect(() => {
        IncidentFSM.transition(IncidentState.OPEN, IncidentState.RESOLVED);
      }).toThrow('Invalid state transition from OPEN to RESOLVED');
    });

    it('should throw an error when attempting to reopen a CLOSED incident', () => {
      expect(() => {
        IncidentFSM.transition(IncidentState.CLOSED, IncidentState.OPEN);
      }).toThrow('Invalid state transition from CLOSED to OPEN');
    });
  });
});
