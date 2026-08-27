import { BadRequestException } from '@nestjs/common';
import { NewsMediaService, validateNewsImage } from './news-media.service';

describe('news media', () => {
  const cloudinary = { uploadFile: jest.fn() };
  const service = new NewsMediaService(cloudinary);

  beforeEach(() => jest.clearAllMocks());

  it('rejects non-image files before upload', () => {
    expect(() =>
      validateNewsImage({
        buffer: Buffer.from('x'),
        mimetype: 'application/pdf',
        size: 1,
      }),
    ).toThrow(BadRequestException);
    expect(cloudinary.uploadFile).not.toHaveBeenCalled();
  });

  it('uploads a bounded news image and returns storage metadata', async () => {
    const file = {
      buffer: Buffer.from('image'),
      mimetype: 'image/png',
      size: 5,
      originalname: 'banner.png',
    };
    cloudinary.uploadFile.mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/banner.png',
      public_id: 'vnru/news/banner',
      width: 1200,
      height: 630,
      format: 'png',
    });

    await expect(service.upload(file)).resolves.toEqual({
      url: 'https://res.cloudinary.com/demo/image/upload/banner.png',
      publicId: 'vnru/news/banner',
      width: 1200,
      height: 630,
      format: 'png',
    });
    expect(cloudinary.uploadFile).toHaveBeenCalledWith(file, {
      folder: 'vnru/news',
      resource_type: 'image',
    });
  });
});
