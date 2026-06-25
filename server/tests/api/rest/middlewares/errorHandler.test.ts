import { errorHandler } from '../../../../src/api/rest/middlewares/errorHandler';
import { BadRequestError } from '../../../../src/api/rest/ApiErrors';
import { Request, Response, NextFunction } from 'express';

describe('ErrorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle known ApiErrors and return correct status code and message', () => {
    const error = new BadRequestError('Missing required fields');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Missing required fields',
      },
    });
  });

  it('should handle unknown errors by returning 500 Internal Server Error', () => {
    const error = new Error('Database connection failed');
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Internal Server Error',
      },
    });

    // Clean up mock
    (console.error as jest.Mock).mockRestore();
  });
});
