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

  it('publishes featured news with a server timestamp', async () => {
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
