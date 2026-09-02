import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import {
  MAX_NEWS_IMAGE_BYTES,
  NewsMediaService,
  type NewsImageFile,
} from './news-media.service';
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
    .union([z.string(), z.array(z.string())])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .pipe(z.array(z.enum([
      'ARTICLE',
      'EVENT',
      'ANNOUNCEMENT',
      'PROJECT',
      'OPPORTUNITY',
      'PUBLICATION',
    ])))
    .optional(),
  q: z.string().trim().max(200).optional(),
  scope: z.enum(['vietnam', 'russia', 'bilateral']).optional(),
  period: z.enum(['7days', '30days']).optional(),
});
const adminQuerySchema = paginationSchema.extend({
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
  category: z.string().optional(),
  query: z.string().trim().optional(),
  sort: z
    .enum(['updated-desc', 'updated-asc', 'title-asc'])
    .default('updated-desc'),
  featured: z.preprocess((val) => {
    if (val === 'true' || val === true) return true;
    if (val === 'false' || val === false) return false;
    return undefined;
  }, z.boolean().optional()),
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
    isFeatured: z.boolean().optional(),
    translations: z
      .object({
        VI: translationSchema.optional(),
        EN: translationSchema.optional(),
        RU: translationSchema.optional(),
      })
      .strict()
      .refine(
        (value) => Object.keys(value).length > 0,
        'At least one translation is required',
      ),
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
    isFeatured: z.boolean().optional(),
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
      featured: input.featured,
      limit: input.limit,
      offset: input.offset,
      category: input.category,
      contentTypes: input.contentType,
      query: input.q,
      scope: input.scope,
      publishedAfter: input.period
        ? new Date(Date.now() - Number.parseInt(input.period) * 86_400_000)
        : undefined,
      locale: localeMap[input.locale],
    });
  }

  @Get(':id')
  get(@Param('id') id: string, @Query('locale') locale?: string) {
    const parsedLocale = parse(localeSchema, locale);
    return this.service.getPublic(
      parse(uuidSchema, id),
      localeMap[parsedLocale],
    );
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
    FileInterceptor('file', { limits: { fileSize: MAX_NEWS_IMAGE_BYTES } }),
  )
  uploadMedia(@UploadedFile() file?: NewsImageFile) {
    return this.media.upload(file as NewsImageFile);
  }

  @Get()
  @RequirePermission('content.article.read')
  list(@Query() query: Record<string, unknown>) {
    const input = parse(adminQuerySchema, query);
    return this.service.listAdmin(input);
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

  @Delete(':id')
  @RequirePermission('content.article.update')
  delete(@Param('id') id: string) {
    return this.service.delete(parse(uuidSchema, id));
  }

}
