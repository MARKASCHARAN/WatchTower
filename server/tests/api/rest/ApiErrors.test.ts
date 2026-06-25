import { BadRequestError, NotFoundError, InternalServerError, ConflictError, ForbiddenError, UnauthorizedError } from '../../../src/api/rest/ApiErrors';

describe('ApiErrors', () => {
  it('should correctly set properties for BadRequestError', () => {
    const error = new BadRequestError('Invalid input');
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  it('should correctly set properties for UnauthorizedError', () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe('Unauthorized');
    expect(error.statusCode).toBe(401);
  });

  it('should correctly set properties for ForbiddenError', () => {
    const error = new ForbiddenError();
    expect(error.message).toBe('Forbidden');
    expect(error.statusCode).toBe(403);
  });

  it('should correctly set properties for NotFoundError', () => {
    const error = new NotFoundError('User not found');
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
  });

  it('should correctly set properties for ConflictError', () => {
    const error = new ConflictError();
    expect(error.message).toBe('Conflict');
    expect(error.statusCode).toBe(409);
  });

  it('should set isOperational to false for InternalServerError', () => {
    const error = new InternalServerError();
    expect(error.message).toBe('Internal Server Error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});
