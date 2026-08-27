import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';

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

@Injectable()
export class NewsMediaService {
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
}
