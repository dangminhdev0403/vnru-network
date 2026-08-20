import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import type { ParsedExpertQuery } from './expert-query';

export const PRISMA = Symbol('PRISMA');

const publicInclude = { organization: true, expertises: { include: { expertise: true } } } as const;
const publicWhere = { visibility: 'PUBLIC' as const, organization: { visibility: 'PUBLIC' as const } };

@Injectable()
export class ExpertRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  findPublic(query: ParsedExpertQuery, take: number) {
    const filters: any[] = [{ visibility: 'PUBLIC' }, { organization: { visibility: 'PUBLIC' } }];
    if (query.q) filters.push({ displayName: { contains: query.q, mode: 'insensitive' } });
    if (query.country) filters.push({ country: query.country });
    if (query.organization) filters.push({ organizationId: query.organization });
    if (query.language) filters.push({ language: query.language });
    if (query.topic) filters.push({ expertises: { some: { expertise: { slug: query.topic } } } });
    if (query.cursor) filters.push({ OR: [{ createdAt: { lt: new Date(query.cursor.createdAt) } }, { createdAt: new Date(query.cursor.createdAt), id: { lt: query.cursor.id } }] });
    return this.prisma.researcherProfile.findMany({ where: { AND: filters }, take, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], include: publicInclude });
  }

  findPublicById(id: string) {
    return this.prisma.researcherProfile.findFirst({ where: { id, ...publicWhere }, include: publicInclude });
  }

  // ponytail: loads all public profiles; push matching into SQL if candidate count exceeds ~1k
  findPublicCandidates() {
    return this.prisma.researcherProfile.findMany({ where: publicWhere, include: publicInclude });
  }
}
