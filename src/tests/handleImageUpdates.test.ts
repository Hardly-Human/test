
import { ImageUpdateHandler } from '../controllers/handleImageUpdates';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Image } from '../models/Image';

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    save: jest.fn(),
  }),
}));

describe('handleImageUpdates', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {
        id: 'image123',
      },
      body: {
        title: 'Updated Image Title',
        description: 'Updated Image Description',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should update the image metadata', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue({
      id: 'image123',
      title: 'Old Image Title',
      description: 'Old Image Description',
      url: 'https://cloudfront.example.com/test-image.jpg',
    });

    await ImageUpdateHandler(req as Request, res as Response);

    // Test if the image metadata is updated
    expect(getRepository(Image).save).toHaveBeenCalledWith({
      id: 'image123',
      title: 'Updated Image Title',
      description: 'Updated Image Description',
      url: 'https://cloudfront.example.com/test-image.jpg',
    });

    // Test if the response is sent with the updated image metadata
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Image metadata updated successfully',
      image: {
        id: 'image123',
        title: 'Updated Image Title',
        description: 'Updated Image Description',
        url: 'https://cloudfront.example.com/test-image.jpg',
      },
    });
  });

  it('should return 404 if the image is not found', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue(null);

    await ImageUpdateHandler(req as Request, res as Response);

    // Test if 404 is returned when the image is not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
  });
});
