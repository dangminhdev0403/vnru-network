import { BadRequestException } from '@nestjs/common';
import type {
  Bucket,
  DeleteFileOptions,
  SaveOptions,
} from '@google-cloud/storage';
import {
  MAX_NEWS_IMAGE_BYTES,
  NewsMediaService,
  newsImageObjectName,
  validateNewsImage,
} from './news-media.service';

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

describe('news media', () => {
  let uploadedBuffer: Buffer | undefined;
  let uploadOptions: SaveOptions | undefined;
  let deletedOptions: DeleteFileOptions | undefined;
  let selectedObjectName: string | undefined;
  let fileCalls = 0;
  let saveError: Error | undefined;
  const save = (data: Buffer, options?: SaveOptions): Promise<void> => {
    uploadedBuffer = data;
    uploadOptions = options;
    return saveError ? Promise.reject(saveError) : Promise.resolve();
  };
  const remove = (options?: DeleteFileOptions): Promise<[unknown]> => {
    deletedOptions = options;
    return Promise.resolve([{}]);
  };
  const object = { save, delete: remove };
  const file = (name: string) => {
    fileCalls += 1;
    selectedObjectName = name;
    return object;
  };
  const bucket = {
    name: 'vnru-public-media',
    file,
  } as unknown as Bucket;
  const service = new NewsMediaService(bucket);

  beforeEach(() => {
    uploadedBuffer = undefined;
    uploadOptions = undefined;
    deletedOptions = undefined;
    selectedObjectName = undefined;
    fileCalls = 0;
    saveError = undefined;
  });

  it('only derives object names for this GCS news prefix', () => {
    expect(
      newsImageObjectName(
        'https://storage.googleapis.com/vnru-public-media/vnru/news/photo.webp',
        'vnru-public-media',
      ),
    ).toBe('vnru/news/photo.webp');
    expect(
      newsImageObjectName(
        'https://storage.googleapis.com/other/vnru/news/photo.webp',
        'vnru-public-media',
      ),
    ).toBeNull();
    expect(
      newsImageObjectName(
        'https://storage.googleapis.com/vnru-public-media/other/photo.webp',
        'vnru-public-media',
      ),
    ).toBeNull();
  });

  it('rejects spoofed image MIME before provider upload', async () => {
    await expect(
      validateNewsImage({
        buffer: Buffer.from('not an image'),
        mimetype: 'image/png',
        size: 12,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(fileCalls).toBe(0);
  });

  it('accepts images up to 20 MB and rejects larger files', async () => {
    await expect(
      validateNewsImage({
        buffer: PNG_1X1,
        mimetype: 'image/png',
        size: PNG_1X1.length,
      }),
    ).resolves.toEqual(
      expect.objectContaining({ format: 'png', width: 1, height: 1 }),
    );
    expect(MAX_NEWS_IMAGE_BYTES).toBe(20 * 1024 * 1024);
    await expect(
      validateNewsImage({
        buffer: PNG_1X1,
        mimetype: 'image/png',
        size: MAX_NEWS_IMAGE_BYTES + 1,
      }),
    ).rejects.toThrow('Image must not exceed 20 MB');
  });

  it('uploads a validated image with immutable metadata', async () => {
    const result = await service.upload({
      buffer: PNG_1X1,
      mimetype: 'image/png',
      size: PNG_1X1.length,
      originalname: 'banner.png',
    });

    expect(result.url).toMatch(
      /^https:\/\/storage\.googleapis\.com\/vnru-public-media\/vnru\/news\/[0-9a-f-]+\.png$/,
    );
    expect(result.publicId).toMatch(/^vnru\/news\/[0-9a-f-]+\.png$/);
    expect(result).toMatchObject({ width: 1, height: 1, format: 'png' });
    expect(uploadedBuffer).toBeInstanceOf(Buffer);
    expect(uploadedBuffer?.length).toBeGreaterThan(0);
    expect(uploadOptions).toMatchObject({
      resumable: false,
      validation: 'crc32c',
      preconditionOpts: { ifGenerationMatch: 0 },
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });
  });

  it('sanitizes provider failures', async () => {
    saveError = new Error('provider secret detail');

    await expect(
      service.upload({
        buffer: PNG_1X1,
        mimetype: 'image/png',
        size: PNG_1X1.length,
      }),
    ).rejects.toThrow('Image upload failed');
  });

  it('deletes only URLs owned by the configured bucket and prefix', async () => {
    await service.delete([
      'https://storage.googleapis.com/vnru-public-media/vnru/news/owned.webp',
      'https://storage.googleapis.com/other/vnru/news/foreign.webp',
      'https://storage.googleapis.com/vnru-public-media/other/foreign.webp',
    ]);

    expect(fileCalls).toBe(1);
    expect(selectedObjectName).toBe('vnru/news/owned.webp');
    expect(deletedOptions).toEqual({ ignoreNotFound: true });
  });
});
