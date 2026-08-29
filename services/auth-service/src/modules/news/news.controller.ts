import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsMediaService, type NewsImageFile } from './news-media.service';
import { z } from 'zod';
import {
  AuthenticatedRequestGuard,
  RequireAnyPermission,
  RequirePermission,
  type AuthenticatedRequest,
} from '../authentication/authenticated-request-context';
import { NewsService, type NewsLocale } from './news.service';

const localeSchema = z.enum(['vi', 'en', 'ru']).default('vi');
const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
const publicQuerySchema = paginationSchema.extend({
  featured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  locale: localeSchema,
  category: z.string().optional(),
  contentType: z
    .enum([
      'ARTICLE',
      'EVENT',
      'ANNOUNCEMENT',
      'PROJECT',
      'OPPORTUNITY',
      'PUBLICATION',
    ])
    .optional(),
});
const adminQuerySchema = paginationSchema.extend({
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});
const translationSchema = z
  .object({
    title: z.string().trim().min(1).max(250),
    summary: z.string().trim().min(1).max(1000),
    content: z.string().trim().min(1).max(100_000),
    actionLabel: z.string().trim().min(1).max(200).nullable().optional(),
  })
  .strict();
const articleFields = {
  category: z.enum([
    'science-technology',
    'economy-society',
    'education',
    'cooperation',
  ]),
  coverImageUrl: z.url().max(2000).nullable().optional(),
  contentType: z
    .enum([
      'ARTICLE',
      'EVENT',
      'ANNOUNCEMENT',
      'PROJECT',
      'OPPORTUNITY',
      'PUBLICATION',
    ])
    .optional(),
  actionUrl: z.url().max(2000).nullable().optional(),
  actionClosesAt: z.coerce.date().nullable().optional(),
  sourceUrls: z.array(z.url().max(2000)).max(10).optional(),
};
const createSchema = z
  .object({
    ...articleFields,
    translations: z
      .object({
        VI: translationSchema,
        EN: translationSchema,
        RU: translationSchema,
      })
      .strict(),
  })
  .strict();
const updateSchema = z
  .object({
    ...Object.fromEntries(
      Object.entries(articleFields).map(([key, value]) => [
        key,
        value.optional(),
      ]),
    ),
    translations: z
      .object({
        VI: translationSchema.optional(),
        EN: translationSchema.optional(),
        RU: translationSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    'At least one field is required',
  );
const publishSchema = z
  .object({ isFeatured: z.boolean().default(false) })
  .strict();
const uuidSchema = z.string().uuid();
const localeMap = { vi: 'VI', en: 'EN', ru: 'RU' } as const;

function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success)
    throw new BadRequestException(
      parsed.error.issues[0]?.message ?? 'Invalid request',
    );
  return parsed.data;
}

@Controller('api/v1/news')
export class PublicNewsController {
  constructor(private readonly service: NewsService) {}

  @Get()
  list(@Query() query: Record<string, unknown>) {
    const input = parse(publicQuerySchema, query);
    return this.service.listPublic({
      ...input,
      locale: localeMap[input.locale],
    });
  }

  @Get(':id')
  get(@Param('id') id: string, @Query('locale') locale?: string) {
    const parsedLocale = parse(localeSchema, locale);
    return this.service.getPublic(parse(uuidSchema, id), localeMap[parsedLocale]);
  }
}

@Controller('api/v1/admin/news')
@UseGuards(AuthenticatedRequestGuard)
export class AdminNewsController {
  constructor(
    private readonly service: NewsService,
    private readonly media: NewsMediaService,
  ) {}

  @Post('media')
  @RequireAnyPermission('content.article.create', 'content.article.update')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  uploadMedia(@UploadedFile() file?: NewsImageFile) {
    return this.media.upload(file as NewsImageFile);
  }

  @Get()
  @RequirePermission('content.article.read')
  list(@Query() query: Record<string, unknown>) {
    const input = parse(adminQuerySchema, query);
    return this.service.listAdmin(input.limit, input.offset, input.status);
  }

  @Get(':id')
  @RequirePermission('content.article.read')
  get(@Param('id') id: string) {
    return this.service.getAdmin(parse(uuidSchema, id));
  }

  @Post()
  @RequirePermission('content.article.create')
  create(@Body() body: unknown, @Req() request: AuthenticatedRequest) {
    const authorId = request.authContext?.userId;
    if (!authorId)
      throw new UnauthorizedException('Actor ID not found in request context');
    return this.service.create({ ...parse(createSchema, body), authorId });
  }

  @Patch(':id')
  @RequirePermission('content.article.update')
  update(@Param('id') id: string, @Body() body: unknown) {
    return this.service.update(
      parse(uuidSchema, id),
      parse(updateSchema, body),
    );
  }

  @Post(':id/publish')
  @RequirePermission('content.article.publish')
  publish(@Param('id') id: string, @Body() body: unknown) {
    const input = parse(publishSchema, body);
    return this.service.publish(parse(uuidSchema, id), input.isFeatured);
  }

  @Post(':id/unpublish')
  @RequirePermission('content.article.publish')
  unpublish(@Param('id') id: string) {
    return this.service.unpublish(parse(uuidSchema, id));
  }
}
