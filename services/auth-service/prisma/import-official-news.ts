import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

type OfficialArticle = {
  id: number;
  title: string;
  summary: string;
  category: keyof typeof categories;
  image: string | null;
  body: string[];
  sources: string[];
};

const categories = {
  science: 'science-technology',
  society: 'economy-society',
  education: 'education',
  cooperation: 'cooperation',
} as const;

const articleId = (id: number) => {
  const hex = createHash('sha256').update(`vnru-official-news:${id}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
};

async function main() {
  const catalogUrl = pathToFileURL(resolve(__dirname, '../../../frontend/features/public-v2/data/official-news.ts')).href;
  const { OFFICIAL_NEWS } = await import(catalogUrl) as { OFFICIAL_NEWS: OfficialArticle[] };
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const editor = await prisma.roleAssignment.findFirst({
      where: { role: { name: 'CONTENT_EDITOR' }, status: 'ACTIVE' },
      select: { userId: true },
    });
    if (!editor) throw new Error('Active CONTENT_EDITOR assignment is required');

    for (const item of OFFICIAL_NEWS) {
      const existing = await prisma.newsArticle.findFirst({
        where: { translations: { some: { locale: 'VI', title: item.title } } },
        select: { id: true },
      });
      const article = await prisma.newsArticle.upsert({
        where: { id: existing?.id ?? articleId(item.id) },
        update: {
          category: categories[item.category],
          coverImageUrl: item.image,
          sourceUrls: item.sources,
          status: 'PUBLISHED',
        },
        create: {
          id: articleId(item.id),
          category: categories[item.category],
          contentType: 'ARTICLE',
          coverImageUrl: item.image,
          sourceUrls: item.sources,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          authorId: editor.userId,
        },
        select: { id: true },
      });
      await prisma.newsArticleTranslation.upsert({
        where: { articleId_locale: { articleId: article.id, locale: 'VI' } },
        update: { title: item.title, summary: item.summary, content: item.body.join('\n\n') },
        create: { articleId: article.id, locale: 'VI', title: item.title, summary: item.summary, content: item.body.join('\n\n') },
      });
    }
    console.log(`Imported ${OFFICIAL_NEWS.length} official news articles`);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
