
import { ImageUploadHandler } from '../controllers/handleImageUpload';
import { Request, Response } from 'express';
import { S3 } from 'aws-sdk';
import { getRepository } from 'typeorm';
import { Image } from '../models/Image';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      upload: jest.fn((params, callback) => callback(null, { Location: 'https://cloudfront.example.com/some-image-url' })),
    })),
  };
});

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    save: jest.fn(),
  }),
}));

describe('ImageUploadHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockS3Instance: any;

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Image',
        description: 'Test Description',
      },
      file: {
        buffer: Buffer.from('image content'),
        originalname: 'test-image.jpg',
        fieldname: 'file',              // Fieldname in the form
        encoding: '7bit',               // Encoding of the file
        mimetype: 'image/jpeg',         // File mime type
        size: 12345,                    // File size in bytes
        destination: '/uploads',        // Where the file is saved (if multer is set to save locally)
        filename: 'test-image.jpg',     // The name of the file on the server
        path: '/uploads/test-image.jpg' // Path of the file saved locally
      } as Express.Multer.File,
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockS3Instance = new S3();
  });

  it('should upload image to S3 and save metadata in database', async () => {
    await ImageUploadHandler(req as Request, res as Response);

    // Test if S3 upload was called
    expect(mockS3Instance.upload).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));

    // Test if metadata was saved in the database
    expect(getRepository(Image).save).toHaveBeenCalledWith({
      title: 'Test Image',
      description: 'Test Description',
      url: 'https://cloudfront.example.com/some-image-url',
      userId: 'user123',
    });

    // Test if the response was sent correctly
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Image uploaded successfully',
      url: 'https://cloudfront.example.com/some-image-url',
    });
  });
});
