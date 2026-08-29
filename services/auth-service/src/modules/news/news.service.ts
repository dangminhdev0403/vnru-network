import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export const NEWS_PRISMA = 'NEWS_PRISMA';
export type NewsLocale = 'VI' | 'EN' | 'RU';
export type NewsStatus = 'DRAFT' | 'PUBLISHED';
export type NewsContentType = 'ARTICLE' | 'EVENT' | 'ANNOUNCEMENT' | 'PROJECT' | 'OPPORTUNITY' | 'PUBLICATION';

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
  };
}

const articleSelect = {
  id: true,
  category: true,
  contentType: true,
  coverImageUrl: true,
  status: true,
  isFeatured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  actionUrl: true,
  actionClosesAt: true,
  sourceUrls: true,
  translations: {
    select: { locale: true, title: true, summary: true, content: true, actionLabel: true },
  },
};

function localize(article: any, locale: NewsLocale) {
  const translation =
    article.translations?.find((item: any) => item.locale === locale) ??
    article.translations?.find((item: any) => item.locale === 'VI');
  const { translations: _translations, ...rest } = article;
  return { ...rest, ...translation, locale: translation?.locale ?? 'VI' };
}

@Injectable()
export class NewsService {
  constructor(@Inject(NEWS_PRISMA) private readonly prisma: NewsPrismaClient) {}

  async listPublic(input: {
    featured?: boolean;
    limit: number;
    offset: number;
    locale?: NewsLocale;
    category?: string;
    contentType?: NewsContentType;
  }) {
    const articles = await this.prisma.newsArticle.findMany({
      where: {
        status: 'PUBLISHED',
        ...(input.featured === undefined ? {} : { isFeatured: input.featured }),
        ...(input.category === undefined ? {} : { category: input.category }),
        ...(input.contentType === undefined ? {} : { contentType: input.contentType }),
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: input.limit,
      skip: input.offset,
      select: articleSelect,
    });
    return articles.map((article) => localize(article, input.locale ?? 'VI'));
  }

  async getPublic(id: string, locale: NewsLocale = 'VI') {
    const article = await this.prisma.newsArticle.findFirst({
      where: { id, status: 'PUBLISHED' },
      select: articleSelect,
    });
    if (!article) throw new NotFoundException('News article not found');
    return localize(article, locale);
  }

  listAdmin(limit: number, offset: number, status?: NewsStatus) {
    return this.prisma.newsArticle.findMany({
      ...(status ? { where: { status } } : {}),
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset,
      select: articleSelect,
    });
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
    authorId: string;
    translations: Record<NewsLocale, NewsTranslationInput>;
  }) {
    const { translations, ...data } = input;
    return this.prisma.newsArticle.create({
      data: {
        ...data,
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

  update(
    id: string,
    input: {
      category?: string;
      contentType?: NewsContentType;
      coverImageUrl?: string | null;
      actionUrl?: string | null;
      actionClosesAt?: Date | null;
      sourceUrls?: string[];
      translations?: Partial<Record<NewsLocale, NewsTranslationInput>>;
    },
  ) {
    const { translations, ...fields } = input;
    return this.prisma.newsArticle.update({
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
  }

  async publish(id: string, isFeatured: boolean) {
    const article = await this.prisma.newsArticle.findFirst({
      where: { id },
      select: { coverImageUrl: true },
    });
    if (!article) throw new NotFoundException('News article not found');
    if (!article.coverImageUrl)
      throw new BadRequestException(
        'Cover image upload must finish before publishing',
      );
    return this.prisma.newsArticle.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date(), isFeatured },
      select: articleSelect,
    });
  }

  unpublish(id: string) {
    return this.prisma.newsArticle.update({
      where: { id },
      data: { status: 'DRAFT', publishedAt: null, isFeatured: false },
      select: articleSelect,
    });
  }
}
