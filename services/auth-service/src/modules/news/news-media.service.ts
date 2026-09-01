import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'nestjs-cloudinary';
import { validateConfig } from '../../config';

export const MAX_NEWS_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface NewsImageFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname?: string;
}

export function validateNewsImage(file?: NewsImageFile): asserts file is NewsImageFile {
  if (!file) throw new BadRequestException('Image file is required');
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype))
    throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
  if (file.size > MAX_NEWS_IMAGE_BYTES)
    throw new BadRequestException('Image must not exceed 5 MB');
}

export function newsImagePublicId(url: string, cloudName: string) {
  try {
    const parsed = new URL(url);
    const marker = `/${cloudName}/image/upload/`;
    const path = decodeURIComponent(parsed.pathname);
    const start = path.indexOf('/vnru/news/', marker.length);
    if (
      parsed.hostname !== 'res.cloudinary.com' ||
      !path.startsWith(marker) ||
      start < 0
    )
      return null;
    return path.slice(start + 1).replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

@Injectable()
export class NewsMediaService {
  private readonly logger = new Logger(NewsMediaService.name);

  constructor(private readonly cloudinary: CloudinaryService) {}

  async upload(file: NewsImageFile) {
    validateNewsImage(file);
    const result = await this.cloudinary.uploadFile(
      file as Parameters<CloudinaryService['uploadFile']>[0],
      { folder: 'vnru/news', resource_type: 'image' },
    );
    if ('error' in result || !result.secure_url || !result.public_id)
      throw new BadRequestException('Cloudinary upload failed');
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  }

  async delete(urls: Iterable<string>) {
    const config = validateConfig();
    cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    });
    const publicIds = [
      ...new Set(
        [...urls]
          .map((url) => newsImagePublicId(url, config.CLOUDINARY_CLOUD_NAME))
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const results = await Promise.allSettled(
      publicIds.map((id) =>
        cloudinary.uploader.destroy(id, { resource_type: 'image' }),
      ),
    );
    results.forEach((result, index) => {
      if (result.status === 'rejected')
        this.logger.warn(`Could not delete news image ${publicIds[index]}`);
    });
  }
}
