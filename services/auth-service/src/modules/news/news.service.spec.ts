import { NewsService } from './news.service';

describe('NewsService', () => {
  const prisma = {
    newsArticle: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };
  const media = { delete: jest.fn().mockResolvedValue(undefined) };
  const service = new NewsService(prisma, media as any);

  beforeEach(() => jest.clearAllMocks());

  it('lists featured articles for the home feed', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);
    prisma.newsArticle.count.mockResolvedValue(0);

    await service.listPublic({ featured: true, limit: 4, offset: 0 });

    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith({
      where: { isFeatured: true },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      take: 4,
      skip: 0,
      select: expect.any(Object),
    });
    expect(prisma.newsArticle.count).toHaveBeenCalledWith({
      where: { isFeatured: true },
    });
  });

  it('filters and paginates public articles before reading rows', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);
    prisma.newsArticle.count.mockResolvedValue(7);
    const publishedAfter = new Date('2026-08-26T00:00:00.000Z');

    const result = await service.listPublic({
      limit: 10,
      offset: 0,
      category: 'science-technology',
      contentTypes: ['EVENT', 'ARTICLE'],
      query: 'photon',
      publishedAfter,
    });

    const where = {
      category: 'science-technology',
      contentType: { in: ['EVENT', 'ARTICLE'] },
      publishedAt: { gte: publishedAfter },
      translations: {
        some: {
          OR: [
            { title: { contains: 'photon', mode: 'insensitive' } },
            { summary: { contains: 'photon', mode: 'insensitive' } },
            { content: { contains: 'photon', mode: 'insensitive' } },
          ],
        },
      },
    };
    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where, take: 10, skip: 0 }),
    );
    expect(prisma.newsArticle.count).toHaveBeenCalledWith({ where });
    expect(result).toEqual({ items: [], total: 7 });
  });

  it('excludes the current article in backend-owned related queries', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);
    prisma.newsArticle.count.mockResolvedValue(0);

    await service.listPublic({
      limit: 4,
      offset: 0,
      category: 'cooperation',
      excludeId: 'article-1',
    });

    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { category: 'cooperation', NOT: { id: 'article-1' } },
        take: 4,
        skip: 0,
      }),
    );
  });

  it('loads an article by id using an available locale when the requested one is missing', async () => {
    prisma.newsArticle.findFirst.mockResolvedValue({
      id: 'article-1',
      translations: [
        { locale: 'RU', title: 'Новость', summary: 'Кратко', content: 'Текст' },
      ],
    });

    await expect(service.getPublic('article-1', 'EN')).resolves.toMatchObject({
      id: 'article-1',
      locale: 'RU',
      title: 'Новость',
    });
    expect(prisma.newsArticle.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'article-1' },
      }),
    );
  });

  it('returns all translations for admin editing', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([
      {
        id: 'article-1',
        translations: [
          { locale: 'VI', title: 'Tin thử' },
          { locale: 'RU', title: 'Тестовая новость' },
          { locale: 'EN', title: 'Test news' },
        ],
      },
    ]);
    prisma.newsArticle.count.mockResolvedValue(0);
    prisma.newsArticle.findFirst.mockResolvedValue({
      id: 'article-1',
      translations: [{ locale: 'VI', title: 'Tin thử' }],
    });

    const res = await service.listAdmin({
      limit: 20,
      offset: 0,
      locale: 'RU',
    });
    expect(res.items[0].translations.map((item: any) => item.locale)).toEqual([
      'RU',
      'VI',
      'EN',
    ]);
    await expect(service.getAdmin('article-1')).resolves.toMatchObject({
      id: 'article-1',
      translations: [{ locale: 'VI', title: 'Tin thử' }],
    });
    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });

  it('filters admin articles by contentType, category and search query with counts', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([
      {
        id: 'article-opp-1',
        category: 'education',
        contentType: 'OPPORTUNITY',
        author: { id: 'user-1', firstName: 'Minh', lastName: 'Dang' },
        translations: [{ locale: 'VI', title: 'Học bổng', summary: 'Tóm tắt' }],
      },
    ]);
    prisma.newsArticle.count
      .mockResolvedValueOnce(1) // total matching filter
      .mockResolvedValueOnce(1) // all count
      .mockResolvedValueOnce(0); // featured count

    const res = await service.listAdmin({
      limit: 10,
      offset: 0,
      contentType: 'OPPORTUNITY',
      category: 'education',
      query: 'học bổng',
    });

    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          contentType: 'OPPORTUNITY',
          category: 'education',
          translations: {
            some: {
              OR: [
                { title: { contains: 'học bổng', mode: 'insensitive' } },
                { summary: { contains: 'học bổng', mode: 'insensitive' } },
              ],
            },
          },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: 10,
        skip: 0,
      }),
    );
    expect(res.total).toBe(1);
    expect(res.counts).toEqual({
      total: 1,
      featured: 0,
    });
    expect(res.items[0].author).toEqual({
      id: 'user-1',
      firstName: 'Minh',
      lastName: 'Dang',
    });
  });

  it('creates a public article with a server timestamp', async () => {
    prisma.newsArticle.create.mockResolvedValue({ id: 'article-1' });

    await service.create({
      category: 'education',
      authorId: 'user-1',
      translations: {
        VI: { title: 'Tin', summary: 'Tóm tắt', content: 'Nội dung' },
        EN: { title: 'News', summary: 'Summary', content: 'Content' },
        RU: { title: 'Новость', summary: 'Кратко', content: 'Текст' },
      },
    });

    expect(prisma.newsArticle.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ publishedAt: expect.any(Date) }),
      }),
    );
  });

  it('deletes an article before cleaning up its Cloudinary images', async () => {
    prisma.newsArticle.findFirst.mockResolvedValue({
      id: 'article-1',
      coverImageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/vnru/news/cover.webp',
      translations: [{
        content: '![Ảnh](https://res.cloudinary.com/demo/image/upload/v1/vnru/news/body.webp)',
      }],
    });
    prisma.newsArticle.delete.mockResolvedValue({ id: 'article-1' });

    await expect(service.delete('article-1')).resolves.toEqual({ ok: true });
    expect(prisma.newsArticle.delete).toHaveBeenCalledWith({
      where: { id: 'article-1' },
    });
    expect(media.delete).toHaveBeenCalledWith(new Set([
      'https://res.cloudinary.com/demo/image/upload/v1/vnru/news/cover.webp',
      'https://res.cloudinary.com/demo/image/upload/v1/vnru/news/body.webp',
    ]));
  });
});
