
import { ImageCommentHandler } from '../controllers/handleImageComment';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../models/Comment';
import { Image } from '../models/Image';

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    save: jest.fn(),
    findOne: jest.fn(),
  }),
}));

describe('handleImageComment', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        text: 'This is a test comment',
      },
      params: {
        id: 'image123',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should add a comment to the image', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue({
      id: 'image123',
      title: 'Test Image',
    });

    await ImageCommentHandler(req as Request, res as Response);

    // Test if the comment was saved in the database
    expect(getRepository(Comment).save).toHaveBeenCalledWith({
      text: 'This is a test comment',
      imageId: 'image123',
      userId: 'user123',
    });

    // Test if the response was sent with the correct message
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment added successfully' });
  });

  it('should return 404 if the image is not found', async () => {
    (getRepository(Image).findOne as jest.Mock).mockResolvedValue(null);

    await ImageCommentHandler(req as Request, res as Response);

    // Test if 404 is returned when the image is not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
  });
});
