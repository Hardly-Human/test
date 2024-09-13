
import { ImageDetailsHandler } from '../controllers/handleImageDetails';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Image } from '../models/Image';

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
  }),
}));

describe('ImageDetailsHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {
        id: 'image123',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return image details for a given image ID', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue({
      id: 'image123',
      title: 'Test Image',
      description: 'Test Description',
      url: 'https://cloudfront.example.com/test-image.jpg',
    });

    await ImageDetailsHandler(req as Request, res as Response);

    // Test if the response was sent with correct data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'image123',
      title: 'Test Image',
      description: 'Test Description',
      url: 'https://cloudfront.example.com/test-image.jpg',
    });
  });

  it('should return 404 if image is not found', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue(null);

    await ImageDetailsHandler(req as Request, res as Response);

    // Test if 404 is returned
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
  });
});
