import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewsMediaService } from './news-media.service';

export const NEWS_PRISMA = 'NEWS_PRISMA';
export type NewsLocale = 'VI' | 'EN' | 'RU';
export type NewsContentType =
  | 'ARTICLE'
  | 'EVENT'
  | 'ANNOUNCEMENT'
  | 'PROJECT'
  | 'OPPORTUNITY'
  | 'KNOWLEDGE'
  | 'PUBLICATION';

const KNOWLEDGE_CATEGORIES = new Set([
  'knowledge-article',
  'knowledge-journal',
  'knowledge-invention',
]);

function validateCategory(contentType: NewsContentType, category: string) {
  if ((contentType === 'KNOWLEDGE') !== KNOWLEDGE_CATEGORIES.has(category)) {
    throw new BadRequestException(`Invalid category for ${contentType}`);
  }
}

export interface PublicListNewsInput {
  featured?: boolean;
  excludeId?: string;
  limit: number;
  offset: number;
  locale?: NewsLocale;
  category?: string;
  contentTypes?: NewsContentType[];
  query?: string;
  publishedAfter?: Date;
  scope?: 'vietnam' | 'russia' | 'bilateral';
}

export interface NewsTranslationInput {
  title: string;
  summary: string;
  content: string;
  actionLabel?: string | null;
}

export interface NewsPrismaClient {
  newsArticle: {
    findMany: (args: Record<string, unknown>) => Promise<any[]>;
    findFirst: (args: Record<string, unknown>) => Promise<any | null>;
    create: (args: Record<string, unknown>) => Promise<any>;
    update: (args: Record<string, unknown>) => Promise<any>;
    delete: (args: Record<string, unknown>) => Promise<any>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
}

export interface AdminListNewsInput {
  limit: number;
  offset: number;
  locale?: NewsLocale;
  contentType?: NewsContentType;
  category?: string;
  query?: string;
  featured?: boolean;
  published?: boolean;
}

export interface AdminNewsListResponse {
  items: any[];
  total: number;
  counts: { total: number; published: number; featured: number };
}

const localePriority = (locale: NewsLocale) =>
  [locale, 'RU', 'VI', 'EN'].filter(
    (item, index, values) => values.indexOf(item) === index,
  );

function prioritizeTranslations(article: any, locale: NewsLocale) {
  const priority = localePriority(locale);
  return {
    ...article,
    translations: [...(article.translations ?? [])].sort(
      (a, b) => priority.indexOf(a.locale) - priority.indexOf(b.locale),
    ),
  };
}

const articleSelect = {
  id: true,
  category: true,
  contentType: true,
  coverImageUrl: true,
  isFeatured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  actionUrl: true,
  actionClosesAt: true,
  sourceUrls: true,
  translations: {
    select: {
      locale: true,
      title: true,
      summary: true,
      content: true,
      actionLabel: true,
    },
  },
};

const adminArticleSelect = {
  id: true,
  category: true,
  contentType: true,
  coverImageUrl: true,
  isFeatured: true,
  publishedAt: true,
  updatedAt: true,
  actionClosesAt: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  translations: {
    select: {
      locale: true,
      title: true,
      summary: true,
    },
  },
};

function localize(article: any, locale: NewsLocale) {
  const translation = localePriority(locale)
    .map((candidate) =>
      article.translations?.find((item: any) => item.locale === candidate),
    )
    .find(Boolean);
  const { translations: _translations, ...rest } = article;
  return { ...rest, ...translation, locale: translation?.locale ?? locale };
}

function articleImageUrls(article: any) {
  const urls = new Set<string>();
  if (article?.coverImageUrl) urls.add(article.coverImageUrl);
  for (const translation of article?.translations ?? []) {
    for (const match of translation.content?.matchAll(
      /https:\/\/res\.cloudinary\.com\/[^\s)'"<>]+/g,
    ) ?? [])
      urls.add(match[0]);
  }
  return urls;
}

@Injectable()
export class NewsService {
  constructor(
    @Inject(NEWS_PRISMA) private readonly prisma: NewsPrismaClient,
    private readonly media: NewsMediaService,
  ) {}

  async listPublic(input: PublicListNewsInput) {
    const query = input.query?.trim();
    const searchable = (values: string[]) => ({
      some: {
        OR: values.flatMap((value) => [
          { title: { contains: value, mode: 'insensitive' } },
          { summary: { contains: value, mode: 'insensitive' } },
          { content: { contains: value, mode: 'insensitive' } },
        ]),
      },
    });
    // ponytail: keyword scope until NewsArticle gets canonical persisted geography.
    const scopeTerms = input.scope
      ? {
          vietnam: ['Việt Nam', 'Hà Nội', 'TP.HCM', 'Đà Nẵng'],
          russia: ['Liên bang Nga', 'Moskva', 'Rosatom'],
          bilateral: ['Việt - Nga', 'Nga - Việt', 'song phương'],
        }[input.scope]
      : undefined;
    const where = {
      ...(input.excludeId ? { NOT: { id: input.excludeId } } : {}),
      ...(input.featured === undefined ? {} : { isFeatured: input.featured }),
      ...(input.category === undefined ? {} : { category: input.category }),
      ...(input.contentTypes?.length
        ? { contentType: { in: input.contentTypes } }
        : { contentType: { not: 'KNOWLEDGE' } }),
      ...(input.publishedAfter
        ? { publishedAt: { not: null, gte: input.publishedAfter } }
        : { publishedAt: { not: null } }),
      ...(query ? { translations: searchable([query]) } : {}),
      ...(scopeTerms
        ? query
          ? { AND: [{ translations: searchable(scopeTerms) }] }
          : { translations: searchable(scopeTerms) }
        : {}),
    };
    const [articles, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        orderBy:
          input.featured === true
            ? [
                { updatedAt: 'desc' },
                { createdAt: 'desc' },
                { id: 'desc' },
              ]
            : [
                { publishedAt: 'desc' },
                { createdAt: 'desc' },
                { id: 'desc' },
              ],
        take: input.limit,
        skip: input.offset,
        select: articleSelect,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);
    return {
      items: articles.map((article) => localize(article, input.locale ?? 'VI')),
      total,
    };
  }

  async getPublic(id: string, locale: NewsLocale = 'VI') {
    const article = await this.prisma.newsArticle.findFirst({
      where: { id, publishedAt: { not: null } },
      select: articleSelect,
    });
    if (!article) throw new NotFoundException('News article not found');
    return localize(article, locale);
  }

  async listAdmin(input: AdminListNewsInput): Promise<AdminNewsListResponse> {
    const where: Record<string, unknown> = {};
    const locale = input.locale ?? 'RU';

    if (input.contentType) {
      where.contentType = input.contentType;
    }
    if (input.category) {
      where.category = input.category;
    }
    if (input.featured !== undefined) {
      where.isFeatured = input.featured;
    }
    if (input.published !== undefined) {
      where.publishedAt = input.published ? { not: null } : null;
    }

    if (input.query && input.query.trim()) {
      const q = input.query.trim();
      where.translations = {
        some: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
          ],
        },
      };
    }

    const countsWhere: Record<string, unknown> = {};
    if (input.contentType) countsWhere.contentType = input.contentType;
    if (input.category) countsWhere.category = input.category;

    const [items, total, allCount, publishedCount, featuredCount] =
      await Promise.all([
        this.prisma.newsArticle.findMany({
          where,
          orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
          take: input.limit,
          skip: input.offset,
          select: adminArticleSelect,
        }),
        this.prisma.newsArticle.count({ where }),
        this.prisma.newsArticle.count({ where: countsWhere }),
        this.prisma.newsArticle.count({
          where: { ...countsWhere, publishedAt: { not: null } },
        }),
        this.prisma.newsArticle.count({
          where: { ...countsWhere, isFeatured: true },
        }),
      ]);

    return {
      items: items.map((article) => prioritizeTranslations(article, locale)),
      total,
      counts: {
        total: allCount,
        published: publishedCount,
        featured: featuredCount,
      },
    };
  }

  async getAdmin(id: string) {
    const article = await this.prisma.newsArticle.findFirst({
      where: { id },
      select: articleSelect,
    });
    if (!article) throw new NotFoundException('News article not found');
    return article;
  }

  create(input: {
    category: string;
    contentType?: NewsContentType;
    coverImageUrl?: string | null;
    actionUrl?: string | null;
    actionClosesAt?: Date | null;
    sourceUrls?: string[];
    isFeatured?: boolean;
    authorId: string;
    translations: Partial<Record<NewsLocale, NewsTranslationInput>>;
  }) {
    validateCategory(input.contentType ?? 'ARTICLE', input.category);
    const { translations, ...data } = input;
    return this.prisma.newsArticle.create({
      data: {
        ...data,
        publishedAt: new Date(),
        translations: {
          create: Object.entries(translations).map(([locale, value]) => ({
            locale,
            ...value,
          })),
        },
      },
      select: articleSelect,
    });
  }

  async update(
    id: string,
    input: {
      category?: string;
      contentType?: NewsContentType;
      coverImageUrl?: string | null;
      actionUrl?: string | null;
      actionClosesAt?: Date | null;
      sourceUrls?: string[];
      isFeatured?: boolean;
      publishedAt?: Date | null;
      translations?: Partial<Record<NewsLocale, NewsTranslationInput>>;
    },
  ) {
    const previous = await this.getAdmin(id);
    validateCategory(
      input.contentType ?? previous.contentType,
      input.category ?? previous.category,
    );
    const { translations, ...fields } = input;
    const updated = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...fields,
        ...(translations
          ? {
              translations: {
                upsert: Object.entries(translations).map(([locale, value]) => ({
                  where: { articleId_locale: { articleId: id, locale } },
                  update: value,
                  create: { locale, ...value },
                })),
              },
            }
          : {}),
      },
      select: articleSelect,
    });
    const retained = articleImageUrls(updated);
    await this.media.delete(
      [...articleImageUrls(previous)].filter((url) => !retained.has(url)),
    );
    return updated;
  }

  async delete(id: string): Promise<{ ok: true }> {
    const article = await this.getAdmin(id);
    await this.prisma.newsArticle.delete({ where: { id } });
    await this.media.delete(articleImageUrls(article));
    return { ok: true };
  }

}
