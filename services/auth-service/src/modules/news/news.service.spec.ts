import { NewsService } from './news.service';

describe('NewsService', () => {
  const prisma = {
    newsArticle: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  const service = new NewsService(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('lists only published featured articles for the home feed', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);

    await service.listPublic({ featured: true, limit: 4, offset: 0 });

    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 4,
      skip: 0,
      select: expect.any(Object),
    });
  });

  it('filters public articles by category and contentType', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);

    await service.listPublic({
      limit: 10,
      offset: 0,
      category: 'science-technology',
      contentType: 'EVENT',
    });

    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'PUBLISHED',
          category: 'science-technology',
          contentType: 'EVENT',
        },
      }),
    );
  });

  it('loads a published article by id', async () => {
    prisma.newsArticle.findFirst.mockResolvedValue({ id: 'article-1', translations: [] });
    await service.getPublic('article-1');
    expect(prisma.newsArticle.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'article-1', status: 'PUBLISHED' } }),
    );
  });

  it('filters admin drafts and returns all translations for editing', async () => {
    prisma.newsArticle.findMany.mockResolvedValue([]);
    prisma.newsArticle.findFirst.mockResolvedValue({
      id: 'article-1',
      translations: [{ locale: 'VI', title: 'Tin thử' }],
    });

    await service.listAdmin(20, 0, 'DRAFT');
    await expect(service.getAdmin('article-1')).resolves.toMatchObject({
      id: 'article-1',
      translations: [{ locale: 'VI', title: 'Tin thử' }],
    });
    expect(prisma.newsArticle.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'DRAFT' } }),
    );
  });

  it('rejects publishing while the cover upload is unfinished', async () => {
    prisma.newsArticle.findFirst.mockResolvedValue({ coverImageUrl: null });

    await expect(service.publish('article-1', true)).rejects.toThrow(
      'Cover image upload must finish before publishing',
    );
    expect(prisma.newsArticle.update).not.toHaveBeenCalled();
  });

  it('publishes featured news with a server timestamp', async () => {
    prisma.newsArticle.findFirst.mockResolvedValue({
      coverImageUrl: 'https://cdn/banner.webp',
    });
    prisma.newsArticle.update.mockResolvedValue({ id: 'article-1' });

    await service.publish('article-1', true);

    expect(prisma.newsArticle.update).toHaveBeenCalledWith({
      where: { id: 'article-1' },
      data: expect.objectContaining({
        status: 'PUBLISHED',
        isFeatured: true,
        publishedAt: expect.any(Date),
      }),
      select: expect.any(Object),
    });
  });
});
