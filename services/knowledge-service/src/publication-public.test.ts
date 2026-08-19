import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PUBLIC_VISIBILITY,
  buildWhere,
  buildPublicWhere,
  projectSummary,
  projectPublicationSummary,
  projectDetail,
  projectPublicationDetail,
} from './publication-public.ts';

describe('Publication Public Helpers', () => {
  describe('PUBLIC_VISIBILITY Constant', () => {
    it('should be defined as PUBLIC', () => {
      assert.equal(PUBLIC_VISIBILITY, 'PUBLIC');
    });
  });

  describe('Prisma-compatible Where Builder', () => {
    it('should return default public visibility query if filters are empty', () => {
      assert.deepEqual(buildWhere(), { visibility: 'PUBLIC' });
      assert.deepEqual(buildWhere(null), { visibility: 'PUBLIC' });
      assert.deepEqual(buildWhere({}), { visibility: 'PUBLIC' });
    });

    it('should conjoin visibility PUBLIC as the first condition of an AND array', () => {
      const filters = { type: 'JOURNAL', year: 2024 };
      const expected = {
        AND: [
          { visibility: 'PUBLIC' },
          { type: 'JOURNAL', year: 2024 }
        ]
      };
      assert.deepEqual(buildWhere(filters), expected);
    });

    it('should flatten with top-level AND if it is already present', () => {
      const filters = {
        AND: [
          { type: 'JOURNAL' },
          { year: 2024 }
        ],
        country: 'VN'
      };
      const expected = {
        AND: [
          { visibility: 'PUBLIC' },
          { type: 'JOURNAL' },
          { year: 2024 }
        ],
        country: 'VN'
      };
      assert.deepEqual(buildWhere(filters), expected);
    });

    it('should ignore and strip caller-supplied visibility key recursively', () => {
      const filters = {
        visibility: 'PRIVATE',
        type: 'CONFERENCE',
        AND: [
          { visibility: 'PRIVATE' },
          { year: 2023 }
        ],
        OR: [
          { visibility: 'PUBLIC' },
          { country: 'RU' }
        ]
      };

      const result = buildWhere(filters);

      // Verify that visibility: 'PRIVATE' / 'PUBLIC' caller-supplied keys are completely removed
      // and only conjoined { visibility: 'PUBLIC' } is at the top-level AND block.
      assert.equal(result.visibility, undefined);
      assert.equal(result.AND[0].visibility, 'PUBLIC');
      assert.deepEqual(result.AND.slice(1), [
        { year: 2023 }
      ]);
      assert.deepEqual(result.OR, [
        { country: 'RU' }
      ]);
    });

    it('should work with array of filters', () => {
      const filters = [
        { type: 'PATENT' },
        { country: 'VN' }
      ];
      const expected = {
        AND: [
          { visibility: 'PUBLIC' },
          { type: 'PATENT' },
          { country: 'VN' }
        ]
      };
      assert.deepEqual(buildWhere(filters), expected);
    });

    it('should have buildPublicWhere alias working identically', () => {
      assert.equal(buildWhere, buildPublicWhere);
    });
  });

  describe('Publication Projection Helpers', () => {
    it('rejects PRIVATE rows instead of relabeling them PUBLIC', () => {
      const privatePublication = { id: 'private', visibility: 'PRIVATE' };
      assert.throws(
        () => projectSummary(privatePublication),
        /Only PUBLIC publications may be projected/,
      );
      assert.throws(
        () => projectDetail(privatePublication),
        /Only PUBLIC publications may be projected/,
      );
    });

    const mockDbPublication = {
      id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
      title: 'Advanced AI Cooperation VN-RU',
      abstract: 'This abstract describes the AI bilateral cooperation.',
      type: 'JOURNAL',
      language: 'en',
      year: 2025,
      country: 'VN',
      organizationRef: 'org-123',
      visibility: 'PUBLIC',
      version: 5,            // Internal DB version
      createdAt: new Date('2026-08-01T00:00:00Z'), // Internal audit fields
      updatedAt: new Date('2026-08-15T00:00:00Z'),
      authors: [
        { id: 'auth-1', publicationId: 'pub-1', expertRef: 'exp-99', displayOrder: 1 }
      ],
      topics: [
        {
          publicationId: 'pub-1',
          topicId: 'topic-77',
          topic: { id: 'topic-77', slug: 'ai-ml', labels: { en: 'AI/ML' } }
        }
      ]
    };

    describe('projectSummary', () => {
      it('should project to summary fields, force PUBLIC visibility, and exclude abstract and internal keys', () => {
        const result = projectSummary(mockDbPublication);

        assert.deepEqual(result, {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Advanced AI Cooperation VN-RU',
          type: 'JOURNAL',
          language: 'en',
          year: 2025,
          country: 'VN',
          organizationRef: 'org-123',
          visibility: 'PUBLIC', // Retains PUBLIC
          authors: [
            { id: 'auth-1', expertRef: 'exp-99', displayOrder: 1 }
          ],
          topics: [
            {
              publicationId: 'pub-1',
              topicId: 'topic-77',
              topic: { id: 'topic-77', slug: 'ai-ml', labels: { en: 'AI/ML' } }
            }
          ]
        });

        // Ensure abstract and internal/private database keys are excluded
        assert.equal('abstract' in result, false);
        assert.equal('version' in result, false);
        assert.equal('createdAt' in result, false);
        assert.equal('updatedAt' in result, false);
      });

      it('should work when authors and topics are missing or undefined', () => {
        const { authors, topics, ...minimalPub } = mockDbPublication;
        const result = projectSummary(minimalPub);

        assert.deepEqual(result, {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Advanced AI Cooperation VN-RU',
          type: 'JOURNAL',
          language: 'en',
          year: 2025,
          country: 'VN',
          organizationRef: 'org-123',
          visibility: 'PUBLIC'
        });
      });

      it('should work when optional organizationRef is null', () => {
        const pub = { ...mockDbPublication, organizationRef: null };
        const result = projectSummary(pub);
        assert.equal(result.organizationRef, null);
      });

      it('should have projectPublicationSummary alias working identically', () => {
        assert.equal(projectSummary, projectPublicationSummary);
      });
    });

    describe('projectDetail', () => {
      it('should project to detail fields including abstract, force PUBLIC visibility, and exclude internal keys', () => {
        const result = projectDetail(mockDbPublication);

        assert.deepEqual(result, {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Advanced AI Cooperation VN-RU',
          abstract: 'This abstract describes the AI bilateral cooperation.', // Included in detail
          type: 'JOURNAL',
          language: 'en',
          year: 2025,
          country: 'VN',
          organizationRef: 'org-123',
          visibility: 'PUBLIC', // Retains PUBLIC
          authors: [
            { id: 'auth-1', expertRef: 'exp-99', displayOrder: 1 }
          ],
          topics: [
            {
              publicationId: 'pub-1',
              topicId: 'topic-77',
              topic: { id: 'topic-77', slug: 'ai-ml', labels: { en: 'AI/ML' } }
            }
          ]
        });

        // Ensure internal/private database keys are excluded
        assert.equal('version' in result, false);
        assert.equal('createdAt' in result, false);
        assert.equal('updatedAt' in result, false);
      });

      it('should work when authors and topics are missing or undefined', () => {
        const { authors, topics, ...minimalPub } = mockDbPublication;
        const result = projectDetail(minimalPub);

        assert.deepEqual(result, {
          id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
          title: 'Advanced AI Cooperation VN-RU',
          abstract: 'This abstract describes the AI bilateral cooperation.',
          type: 'JOURNAL',
          language: 'en',
          year: 2025,
          country: 'VN',
          organizationRef: 'org-123',
          visibility: 'PUBLIC'
        });
      });

      it('should have projectPublicationDetail alias working identically', () => {
        assert.equal(projectDetail, projectPublicationDetail);
      });
    });
  });
});
