import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { Bucket } from '@google-cloud/storage';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

export const NEWS_MEDIA_BUCKET = Symbol('NEWS_MEDIA_BUCKET');
export const MAX_NEWS_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_NEWS_IMAGE_PIXELS = 40_000_000;
export const NEWS_MEDIA_PREFIX = 'vnru/news/';
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MIME_BY_FORMAT = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
} as const;

export interface NewsImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname?: string;
}

export interface ValidatedNewsImage {
  buffer: Buffer;
  contentType: (typeof MIME_BY_FORMAT)[keyof typeof MIME_BY_FORMAT];
  format: keyof typeof MIME_BY_FORMAT;
  width: number;
  height: number;
}

export function publicGcsUrl(bucketName: string, objectName: string) {
  const objectPath = objectName.split('/').map(encodeURIComponent).join('/');
  return `https://storage.googleapis.com/${bucketName}/${objectPath}`;
}

export function newsImageObjectName(url: string, bucketName: string) {
  try {
    const parsed = new URL(url);
    const prefix = `/${bucketName}/`;
    if (
      parsed.protocol !== 'https:' ||
      parsed.hostname !== 'storage.googleapis.com' ||
      !parsed.pathname.startsWith(prefix)
    )
      return null;
    const objectName = decodeURIComponent(parsed.pathname.slice(prefix.length));
    return objectName.startsWith(NEWS_MEDIA_PREFIX) ? objectName : null;
  } catch {
    return null;
  }
}

export async function validateNewsImage(
  file?: NewsImageFile,
): Promise<ValidatedNewsImage> {
  if (!file) throw new BadRequestException('Image file is required');
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype))
    throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
  if (
    file.size > MAX_NEWS_IMAGE_BYTES ||
    file.buffer.length > MAX_NEWS_IMAGE_BYTES
  )
    throw new BadRequestException('Image must not exceed 20 MB');

  try {
    const image = sharp(file.buffer, {
      failOn: 'warning',
      limitInputPixels: MAX_NEWS_IMAGE_PIXELS,
    }).rotate();
    const metadata = await image.metadata();
    const format = metadata.format as keyof typeof MIME_BY_FORMAT;
    const contentType = MIME_BY_FORMAT[format];
    if (!contentType || contentType !== file.mimetype)
      throw new Error('Image content does not match its MIME type');

    const output = await image
      .toFormat(format)
      .toBuffer({ resolveWithObject: true });
    if (!output.info.width || !output.info.height)
      throw new Error('Invalid dimensions');
    if (output.data.length > MAX_NEWS_IMAGE_BYTES)
      throw new Error('Processed image exceeds the byte limit');
    return {
      buffer: output.data,
      contentType,
      format,
      width: output.info.width,
      height: output.info.height,
    };
  } catch {
    throw new BadRequestException('Image content is invalid');
  }
}

@Injectable()
export class NewsMediaService {
  private readonly logger = new Logger(NewsMediaService.name);

  constructor(@Inject(NEWS_MEDIA_BUCKET) private readonly bucket: Bucket) {}

  async upload(file: NewsImageFile) {
    const image = await validateNewsImage(file);
    const objectName = `${NEWS_MEDIA_PREFIX}${randomUUID()}.${image.format === 'jpeg' ? 'jpg' : image.format}`;
    try {
      await this.bucket.file(objectName).save(image.buffer, {
        resumable: false,
        validation: 'crc32c',
        preconditionOpts: { ifGenerationMatch: 0 },
        metadata: {
          contentType: image.contentType,
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      throw new BadRequestException('Image upload failed');
    }
    return {
      url: publicGcsUrl(this.bucket.name, objectName),
      publicId: objectName,
      width: image.width,
      height: image.height,
      format: image.format,
    };
  }

  async delete(urls: Iterable<string>) {
    const objectNames = [
      ...new Set(
        [...urls]
          .map((url) => newsImageObjectName(url, this.bucket.name))
          .filter((name): name is string => Boolean(name)),
      ),
    ];
    const results = await Promise.allSettled(
      objectNames.map((name) =>
        this.bucket.file(name).delete({ ignoreNotFound: true }),
      ),
    );
    results.forEach((result, index) => {
      if (result.status === 'rejected')
        this.logger.warn(`Could not delete news image ${objectNames[index]}`);
    });
  }
}
