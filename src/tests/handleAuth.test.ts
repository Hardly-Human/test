
import { handleAuth } from '../controllers/handleAuth';
import { Request, Response } from 'express';
import { auth } from 'express-openid-connect';

jest.mock('express-openid-connect', () => ({
  auth: jest.fn(),
}));

describe('handleAuth', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should initialize Auth0 middleware', () => {
    handleAuth(req as Request, res as Response);
    
    // Test if Auth0 middleware is initialized
    expect(auth).toHaveBeenCalled();
  });
});
