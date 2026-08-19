import { Injectable } from '@nestjs/common';
import { encodeCursor, type PublicationQuery } from './publication-query';
import { projectSummary } from './publication-public';
import { PublicationRepository } from './publication.repository';

@Injectable()
export class PublicationService {
  constructor(private readonly repository: PublicationRepository) {}
  async list(query: PublicationQuery) {
    const rows = await this.repository.findPublic(query, query.limit + 1);
    const hasMore = rows.length > query.limit;
    const visible = rows.slice(0, query.limit);
    return {
      items: visible.map((row: any) => {
        const projected = projectSummary(row);
        return { ...projected, topics: (projected.topics ?? []).map((entry: any) => entry.topic) };
      }),
      nextCursor: hasMore ? encodeCursor({ createdAt: visible.at(-1)!.createdAt.toISOString(), id: visible.at(-1)!.id }) : null,
    };
  }
}
