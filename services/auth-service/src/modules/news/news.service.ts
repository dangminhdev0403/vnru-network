import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NewsMediaService } from './news-media.service';

export const NEWS_PRISMA = 'NEWS_PRISMA';
export type NewsLocale = 'VI' | 'EN' | 'RU';
export type NewsContentType =
  | 'ARTICLE'
  | 'EVENT'
  | 'ANNOUNCEMENT'
  | 'PROJECT'
  | 'OPPORTUNITY'
  | 'PUBLICATION';

export interface PublicListNewsInput {
  featured?: boolean;
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
  contentType?: NewsContentType;
  category?: string;
  query?: string;
  sort?: 'updated-desc' | 'updated-asc' | 'title-asc';
  featured?: boolean;
}

export interface AdminNewsListResponse {
  items: any[];
  total: number;
  counts: { total: number; featured: number };
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
  const translation =
    article.translations?.find((item: any) => item.locale === locale) ??
    article.translations?.find((item: any) => item.locale === 'VI');
  const { translations: _translations, ...rest } = article;
  return { ...rest, ...translation, locale: translation?.locale ?? 'VI' };
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
      ...(input.featured === undefined ? {} : { isFeatured: input.featured }),
      ...(input.category === undefined ? {} : { category: input.category }),
      ...(input.contentTypes?.length
        ? { contentType: { in: input.contentTypes } }
        : {}),
      ...(input.publishedAfter
        ? { publishedAt: { gte: input.publishedAfter } }
        : {}),
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
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
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
      where: { id },
      select: articleSelect,
    });
    if (!article) throw new NotFoundException('News article not found');
    return localize(article, locale);
  }

  async listAdmin(input: AdminListNewsInput): Promise<AdminNewsListResponse> {
    const where: Record<string, unknown> = {};

    if (input.contentType) {
      where.contentType = input.contentType;
    }
    if (input.category) {
      where.category = input.category;
    }
    if (input.featured !== undefined) {
      where.isFeatured = input.featured;
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

    let orderBy: any = { updatedAt: 'desc' };
    if (input.sort === 'updated-asc') {
      orderBy = { updatedAt: 'asc' };
    } else if (input.sort === 'title-asc') {
      orderBy = { updatedAt: 'desc' };
    }

    const countsWhere: Record<string, unknown> = {};
    if (input.contentType) countsWhere.contentType = input.contentType;
    if (input.category) countsWhere.category = input.category;

    const [items, total, allCount, featuredCount] =
      await Promise.all([
        this.prisma.newsArticle.findMany({
          where,
          orderBy,
          take: input.limit,
          skip: input.offset,
          select: adminArticleSelect,
        }),
        this.prisma.newsArticle.count({ where }),
        this.prisma.newsArticle.count({ where: countsWhere }),
        this.prisma.newsArticle.count({
          where: { ...countsWhere, isFeatured: true },
        }),
      ]);

    return {
      items,
      total,
      counts: {
        total: allCount,
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
    coverImageUrl: string;
    actionUrl?: string | null;
    actionClosesAt?: Date | null;
    sourceUrls?: string[];
    isFeatured?: boolean;
    authorId: string;
    translations: Partial<Record<NewsLocale, NewsTranslationInput>>;
  }) {
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
      translations?: Partial<Record<NewsLocale, NewsTranslationInput>>;
    },
  ) {
    const previous = await this.getAdmin(id);
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
