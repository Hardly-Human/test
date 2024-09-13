
import { ImageDeleteHandler } from '../controllers/handleImageDelete';
import { Request, Response } from 'express';
import { S3 } from 'aws-sdk';
import { getRepository } from 'typeorm';
import { Image } from '../models/Image';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      deleteObject: jest.fn((params, callback) => callback(null, {})),
    })),
  };
});

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn(),
    delete: jest.fn(),
  }),
}));

describe('handleImageDelete', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockS3Instance: any;

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

    mockS3Instance = new S3();
  });

  it('should delete the image from S3 and database', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue({
      id: 'image123',
      url: 'https://cloudfront.example.com/test-image.jpg',
    });

    await ImageDeleteHandler(req as Request, res as Response);

    // Test if S3 deleteObject was called
    expect(mockS3Instance.deleteObject).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

    // Test if the image was deleted from the database
    expect(getRepository(Image).delete).toHaveBeenCalledWith({ id: 'image123' });

    // Test if the response was sent with the correct message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image deleted successfully' });
  });

  it('should return 404 if the image is not found', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue(null);

    await ImageDeleteHandler(req as Request, res as Response);

    // Test if 404 is returned when the image is not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
  });
});
