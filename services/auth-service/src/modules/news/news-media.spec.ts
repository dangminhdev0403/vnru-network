import { BadRequestException } from '@nestjs/common';
import {
  MAX_NEWS_IMAGE_BYTES,
  NewsMediaService,
  newsImagePublicId,
  validateNewsImage,
} from './news-media.service';

describe('news media', () => {
  const cloudinary = { uploadFile: jest.fn() };
  const service = new NewsMediaService(cloudinary);

  beforeEach(() => jest.clearAllMocks());

  it('only derives public IDs for this Cloudinary news folder', () => {
    expect(
      newsImagePublicId(
        'https://res.cloudinary.com/demo/image/upload/v123/vnru/news/photo.webp',
        'demo',
      ),
    ).toBe('vnru/news/photo');
    expect(newsImagePublicId('https://example.com/vnru/news/photo.webp', 'demo')).toBeNull();
    expect(
      newsImagePublicId(
        'https://res.cloudinary.com/demo/image/upload/v123/other/photo.webp',
        'demo',
      ),
    ).toBeNull();
  });

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

  it('accepts images up to 20 MB and rejects larger files', () => {
    expect(() =>
      validateNewsImage({
        buffer: Buffer.alloc(0),
        mimetype: 'image/jpeg',
        size: 20 * 1024 * 1024,
      }),
    ).not.toThrow();
    expect(MAX_NEWS_IMAGE_BYTES).toBe(20 * 1024 * 1024);
    expect(() =>
      validateNewsImage({
        buffer: Buffer.alloc(0),
        mimetype: 'image/jpeg',
        size: MAX_NEWS_IMAGE_BYTES + 1,
      }),
    ).toThrow('Image must not exceed 20 MB');
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
