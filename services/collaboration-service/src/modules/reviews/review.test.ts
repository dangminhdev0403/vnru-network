import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateProposalSnapshot } from './anonymizer.ts';

describe('Review Service Validation Tests', () => {
  test('should PASS snapshot with only allowed root keys and no identifying info', () => {
    const validSnapshot = {
      title: 'Bilateral Quantum Cryptography Cooperation',
      abstract: 'A proposal on building secure communication layers.',
      objectives: 'Design novel algorithms.',
      methodology: 'Iterative feedback loops.',
      expectedOutcomes: 'Trilingual encryption protocol.',
      keywords: ['quantum', 'cryptography', 'security'],
    };
    assert.strictEqual(validateProposalSnapshot(validSnapshot), true);
  });

  test('should REJECT snapshot with extra root keys not in the allowlist', () => {
    const invalidSnapshot = {
      title: 'Quantum Cryptography',
      budget: 500000,
    };
    assert.strictEqual(validateProposalSnapshot(invalidSnapshot), false);
  });

  test('should REJECT nested objects', () => {
    assert.strictEqual(
      validateProposalSnapshot({ title: 'Quantum Cryptography', objectives: { goal: 'Establish links' } }),
      false,
    );
  });

  test('should accept scientific prose mentioning countries and organizations', () => {
    assert.strictEqual(
      validateProposalSnapshot({
        title: 'Quantum Cryptography',
        abstract: 'Compares country-level policy and research organization capacity without identifying applicants.',
      }),
      true,
    );
  });
});
