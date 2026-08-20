import { Injectable } from '@nestjs/common';
import { serializeCursor, type ParsedExpertQuery } from './expert-query';
import { matchExperts, type Expert } from './expert-matching';
import { ExpertRepository } from './expert.repository';

@Injectable()
export class ExpertService {
  constructor(private readonly repository: ExpertRepository) {}

  async list(query: ParsedExpertQuery) {
    const rows = await this.repository.findPublic(query, query.limit + 1);
    const visible = rows.slice(0, query.limit);
    return {
      items: visible.map((r: any) => this.toPublicProjection(r)),
      nextCursor: rows.length > query.limit
        ? serializeCursor({ createdAt: visible.at(-1)!.createdAt.toISOString(), id: visible.at(-1)!.id })
        : null,
    };
  }

  async findById(id: string) {
    const row = await this.repository.findPublicById(id);
    return row ? this.toPublicProjection(row) : null;
  }

  async findMatches(id: string, limit: number) {
    const row: any = await this.repository.findPublicById(id);
    if (!row) return null;

    const candidates: any[] = await this.repository.findPublicCandidates();

    const toExpert = (r: any): Expert => ({
      id: r.id,
      visibility: r.visibility,
      expertise: r.expertises.map((x: any) => ({ id: x.expertise.id, slug: x.expertise.slug, label: x.expertise.slug })),
    });

    const matches = matchExperts(toExpert(row), candidates.map(toExpert), limit);

    const byId = new Map(candidates.map((c: any) => [c.id, c]));
    const labelsById = new Map<string, unknown>();
    for (const c of [row, ...candidates]) {
      for (const x of c.expertises) {
        labelsById.set(x.expertise.id, x.expertise.labels);
      }
    }

    return {
      items: matches.map((m) => ({
        expert: this.toPublicProjection(byId.get(m.candidateId)),
        reasons: m.reasons.map((r) => ({ id: r.id, slug: r.slug, labels: labelsById.get(r.id as string) ?? {} })),
      })),
    };
  }

  private toPublicProjection(r: any) {
    return {
      id: r.id,
      displayName: r.displayName,
      bio: r.bio,
      country: r.country,
      language: r.language,
      visibility: 'PUBLIC',
      organization: { id: r.organization.id, name: r.organization.name, country: r.organization.country },
      expertises: r.expertises.map((x: any) => ({ id: x.expertise.id, slug: x.expertise.slug, labels: x.expertise.labels })),
    };
  }
}
