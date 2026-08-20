import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { PublicationQuery } from './publication-query';

export const PRISMA = Symbol('PRISMA');

@Injectable()
export class PublicationRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  findPublic(query: PublicationQuery, take: number) {
    const filters: object[] = [{ visibility: 'PUBLIC' }];
    if (query.q) filters.push({ title: { contains: query.q, mode: 'insensitive' } });
    if (query.country) filters.push({ country: query.country });
    if (query.organization) filters.push({ organizationRef: query.organization });
    if (query.language) filters.push({ language: query.language });
    if (query.year) filters.push({ year: query.year });
    if (query.topic) filters.push({ topics: { some: { topic: { slug: query.topic } } } });
    if (query.cursor) filters.push({ OR: [
      { createdAt: { lt: new Date(query.cursor.createdAt) } },
      { createdAt: new Date(query.cursor.createdAt), id: { lt: query.cursor.id } },
    ] });
    return this.prisma.publication.findMany({
      where: { AND: filters }, take,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { authors: { orderBy: { displayOrder: 'asc' } }, topics: { include: { topic: true } } },
    });
  }

  findOnePublic(id: string) {
    return this.prisma.publication.findFirst({
      where: { id, visibility: 'PUBLIC' },
      include: { authors: { orderBy: { displayOrder: 'asc' } }, topics: { include: { topic: true } } },
    });
  }
}
