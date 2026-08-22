import { test, describe } from 'node:test';
import assert from 'node:assert';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(val: any): boolean {
  return typeof val === 'string' && UUID_REGEX.test(val);
}

function parseBootstrapData(body: any) {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object');
  }
  if (body.approved !== true) {
    throw new Error('Bootstrap requires explicit approved=true input');
  }
  if (!isUuid(body.leadId)) {
    throw new Error('leadId must be a valid UUID');
  }
  return {
    decisionRef: body.decisionRef,
    proposalRef: body.proposalRef,
    title: body.title,
    leadId: body.leadId,
    approved: true,
  };
}

describe('Project Service Validation & DTO Invariants', () => {
  test('should validate valid UUIDs and reject invalid ones', () => {
    assert.strictEqual(isUuid('d5dee5a7-593d-4240-94a3-35ae8e21fd26'), true);
    assert.strictEqual(isUuid('not-a-uuid'), false);
    assert.strictEqual(isUuid(''), false);
  });

  test('should parse valid bootstrap DTO without requiring fundingProgramId', () => {
    const valid = {
      decisionRef: 'dec-123',
      proposalRef: 'prop-123',
      title: 'Quantum Project',
      leadId: 'd5dee5a7-593d-4240-94a3-35ae8e21fd26',
      approved: true,
    };
    const parsed = parseBootstrapData(valid);
    assert.strictEqual(parsed.title, 'Quantum Project');
    assert.strictEqual(parsed.leadId, 'd5dee5a7-593d-4240-94a3-35ae8e21fd26');
    assert.strictEqual(parsed.approved, true);
  });

  test('should reject bootstrap DTO with unapproved flag', () => {
    const invalid = {
      decisionRef: 'dec-123',
      proposalRef: 'prop-123',
      title: 'Quantum Project',
      leadId: 'd5dee5a7-593d-4240-94a3-35ae8e21fd26',
      approved: false,
    };
    assert.throws(() => parseBootstrapData(invalid), /Bootstrap requires explicit approved=true input/);
  });
});
