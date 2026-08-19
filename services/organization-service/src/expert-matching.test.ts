import { test } from 'node:test';
import assert from 'node:assert';
import { matchExperts } from './expert-matching.ts';
import type { Expert } from './expert-matching.ts';

test('expert matching - basic matchmaking', () => {
  const currentExpert: Expert = {
    id: 1,
    visibility: 'PUBLIC',
    expertise: [
      { id: 'exp1', slug: 'ai-ml', label: 'AI/ML' },
      { id: 'exp2', slug: 'quantum-computing', label: 'Quantum Computing' },
    ],
  };

  const candidates: Expert[] = [
    {
      id: 2,
      visibility: 'PUBLIC',
      expertise: [
        { id: 'exp1', slug: 'ai-ml', label: 'AI/ML' },
        { id: 'exp3', slug: 'blockchain', label: 'Blockchain' },
      ],
    },
    {
      id: 3,
      visibility: 'PUBLIC',
      expertise: [
        { id: 'exp4', slug: 'iot', label: 'IoT' },
      ],
    },
  ];

  const results = matchExperts(currentExpert, candidates);

  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].candidateId, 2);
  assert.strictEqual(results[0].reasons.length, 1);
  assert.strictEqual(results[0].reasons[0].id, 'exp1');
  assert.strictEqual(results[0].reasons[0].slug, 'ai-ml');
  assert.strictEqual(results[0].reasons[0].label, 'AI/ML');

  // Verify no percentage or score parameters exist in results
  assert.strictEqual((results[0] as any).score, undefined);
  assert.strictEqual((results[0] as any).percentage, undefined);
});

test('expert matching - excludes self and non-PUBLIC profiles', () => {
  const currentExpert: Expert = {
    id: 1,
    visibility: 'PUBLIC',
    expertise: [{ id: 'exp1', slug: 'ai-ml', label: 'AI/ML' }],
  };

  const candidates: Expert[] = [
    {
      id: 1, // Self
      visibility: 'PUBLIC',
      expertise: [{ id: 'exp1', slug: 'ai-ml', label: 'AI/ML' }],
    },
    {
      id: 2, // non-PUBLIC
      visibility: 'PRIVATE',
      expertise: [{ id: 'exp1', slug: 'ai-ml', label: 'AI/ML' }],
    },
    {
      id: 3, // Valid matching candidate
      visibility: 'PUBLIC',
      expertise: [{ id: 'exp1', slug: 'ai-ml', label: 'AI/ML' }],
    },
  ];

  const results = matchExperts(currentExpert, candidates);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].candidateId, 3);
});

test('expert matching - sorting: shared count desc, then candidate id asc', () => {
  const currentExpert: Expert = {
    id: 10,
    visibility: 'PUBLIC',
    expertise: [
      { id: 'exp1', slug: 'e1', label: 'E1' },
      { id: 'exp2', slug: 'e2', label: 'E2' },
      { id: 'exp3', slug: 'e3', label: 'E3' },
    ],
  };

  const candidates: Expert[] = [
    {
      id: 3, // 1 overlap, ID 3
      visibility: 'PUBLIC',
      expertise: [{ id: 'exp1', slug: 'e1', label: 'E1' }],
    },
    {
      id: 2, // 2 overlaps, ID 2
      visibility: 'PUBLIC',
      expertise: [
        { id: 'exp1', slug: 'e1', label: 'E1' },
        { id: 'exp2', slug: 'e2', label: 'E2' },
      ],
    },
    {
      id: 4, // 1 overlap, ID 4
      visibility: 'PUBLIC',
      expertise: [{ id: 'exp1', slug: 'e1', label: 'E1' }],
    },
    {
      id: 1, // 2 overlaps, ID 1
      visibility: 'PUBLIC',
      expertise: [
        { id: 'exp1', slug: 'e1', label: 'E1' },
        { id: 'exp2', slug: 'e2', label: 'E2' },
      ],
    },
  ];

  const results = matchExperts(currentExpert, candidates);
  assert.strictEqual(results.length, 4);
  // First, 2 overlaps (IDs: 1 and 2). ID 1 comes before 2 because 1 < 2.
  assert.strictEqual(results[0].candidateId, 1);
  assert.strictEqual(results[1].candidateId, 2);
  // Next, 1 overlap (IDs: 3 and 4). ID 3 comes before 4 because 3 < 4.
  assert.strictEqual(results[2].candidateId, 3);
  assert.strictEqual(results[3].candidateId, 4);
});

test('expert matching - limit validation and capping', () => {
  const currentExpert: Expert = {
    id: 1,
    visibility: 'PUBLIC',
    expertise: [{ id: 'exp1', slug: 'e1', label: 'E1' }],
  };

  const candidates: Expert[] = Array.from({ length: 60 }, (_, i) => ({
    id: i + 2,
    visibility: 'PUBLIC',
    expertise: [{ id: 'exp1', slug: 'e1', label: 'E1' }],
  }));

  // Limit defaults to 50
  const resultsDefault = matchExperts(currentExpert, candidates);
  assert.strictEqual(resultsDefault.length, 50);

  // Custom limit (e.g., 5)
  const resultsCustom = matchExperts(currentExpert, candidates, 5);
  assert.strictEqual(resultsCustom.length, 5);

  // Invalid limits should throw
  assert.throws(() => matchExperts(currentExpert, candidates, 0), /Limit must be an integer between 1 and 50/);
  assert.throws(() => matchExperts(currentExpert, candidates, 51), /Limit must be an integer between 1 and 50/);
  assert.throws(() => matchExperts(currentExpert, candidates, 10.5), /Limit must be an integer between 1 and 50/);
  assert.throws(() => matchExperts(currentExpert, candidates, -5), /Limit must be an integer between 1 and 50/);
});
