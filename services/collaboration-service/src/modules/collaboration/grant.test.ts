import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  createOpportunity,
  publishOpportunity,
  closeOpportunity,
  createProposal,
  confirmProposal,
  reviseProposal,
  submitProposal,
} from './grant.ts';

describe('FundingOpportunity Domain Tests', () => {
  test('should create opportunity in DRAFT state', () => {
    const opp = createOpportunity('opp-123');
    assert.strictEqual(opp.id, 'opp-123');
    assert.strictEqual(opp.state, 'DRAFT');
  });

  test('should transition DRAFT -> PUBLISHED', () => {
    const opp = createOpportunity('opp-123');
    const published = publishOpportunity(opp);
    assert.strictEqual(published.state, 'PUBLISHED');
  });

  test('should transition PUBLISHED -> CLOSED', () => {
    const opp = createOpportunity('opp-123');
    const published = publishOpportunity(opp);
    const closed = closeOpportunity(published);
    assert.strictEqual(closed.state, 'CLOSED');
  });

  test('should fail closed for invalid transitions', () => {
    const opp = createOpportunity('opp-123');

    // DRAFT -> CLOSED (invalid)
    assert.throws(() => closeOpportunity(opp), /Invalid opportunity transition/);

    const published = publishOpportunity(opp);

    // PUBLISHED -> PUBLISHED (invalid)
    assert.throws(() => publishOpportunity(published), /Invalid opportunity transition/);

    const closed = closeOpportunity(published);

    // CLOSED -> PUBLISHED (invalid)
    assert.throws(() => publishOpportunity(closed), /Invalid opportunity transition/);

    // CLOSED -> CLOSED (invalid)
    assert.throws(() => closeOpportunity(closed), /Invalid opportunity transition/);
  });
});

describe('JointProposal Domain Tests', () => {
  test('should create proposal only for a PUBLISHED opportunity', () => {
    const oppDraft = createOpportunity('opp-123');
    assert.throws(
      () => createProposal('prop-1', oppDraft, 'vn-user', 'ru-user', 'initial content'),
      /Cannot create proposal for an opportunity that is not PUBLISHED/
    );

    const oppPublished = publishOpportunity(oppDraft);
    const proposal = createProposal('prop-1', oppPublished, 'vn-user', 'ru-user', 'initial content');

    assert.strictEqual(proposal.id, 'prop-1');
    assert.strictEqual(proposal.opportunityId, 'opp-123');
    assert.strictEqual(proposal.vnParticipantId, 'vn-user');
    assert.strictEqual(proposal.ruParticipantId, 'ru-user');
    assert.strictEqual(proposal.vnConfirmed, false);
    assert.strictEqual(proposal.ruConfirmed, false);
    assert.strictEqual(proposal.state, 'DRAFT');
    assert.strictEqual(proposal.content, 'initial content');
    assert.strictEqual(proposal.revision, 1);
    assert.throws(
      () => createProposal('prop-2', oppPublished, 'same-user', 'same-user', 'content'),
      /must be different users/,
    );
    assert.throws(
      () => createProposal('prop-3', oppPublished, 'vn-user', 'ru-user', '   '),
      /content is required/,
    );
  });

  test('should allow each participant to confirm and transition to PAIRED_CONFIRMED when both confirm', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    let proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    // Confirm VN side
    proposal = confirmProposal(proposal, opp, 'vn-user');
    assert.strictEqual(proposal.vnConfirmed, true);
    assert.strictEqual(proposal.ruConfirmed, false);
    assert.strictEqual(proposal.state, 'DRAFT');

    // Confirm RU side -> yields PAIRED_CONFIRMED
    proposal = confirmProposal(proposal, opp, 'ru-user');
    assert.strictEqual(proposal.vnConfirmed, true);
    assert.strictEqual(proposal.ruConfirmed, true);
    assert.strictEqual(proposal.state, 'PAIRED_CONFIRMED');
  });

  test('should fail closed when invalid participant attempts to confirm', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    const proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    assert.throws(
      () => confirmProposal(proposal, opp, 'intruder-user'),
      /Invalid participant/
    );
  });

  test('should invalidate confirmations on content revision and increment revision number', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    let proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    // Confirm both sides
    proposal = confirmProposal(proposal, opp, 'vn-user');
    proposal = confirmProposal(proposal, opp, 'ru-user');
    assert.strictEqual(proposal.state, 'PAIRED_CONFIRMED');

    // Revise content
    proposal = reviseProposal(proposal, opp, 'updated content', 1);
    assert.strictEqual(proposal.content, 'updated content');
    assert.strictEqual(proposal.vnConfirmed, false);
    assert.strictEqual(proposal.ruConfirmed, false);
    assert.strictEqual(proposal.state, 'DRAFT');
    assert.strictEqual(proposal.revision, 2);
  });

  test('should fail revision on invalid content or optimistic concurrency mismatch', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    const proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    assert.throws(() => reviseProposal(proposal, opp, 'new content', 999), /Concurrency conflict/);
    assert.throws(() => reviseProposal(proposal, opp, 'new content', 0), /positive integer/);
    assert.throws(() => reviseProposal(proposal, opp, '   ', 1), /content is required/);
  });

  test('should allow submission only from PAIRED_CONFIRMED', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    let proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    // Attempt submit from DRAFT
    assert.throws(
      () => submitProposal(proposal, opp),
      /Cannot submit proposal: must be in PAIRED_CONFIRMED state/
    );

    // Confirm one side
    proposal = confirmProposal(proposal, opp, 'vn-user');
    assert.throws(
      () => submitProposal(proposal, opp),
      /Cannot submit proposal: must be in PAIRED_CONFIRMED state/
    );

    // Confirm second side
    proposal = confirmProposal(proposal, opp, 'ru-user');

    // Submit
    const submitted = submitProposal(proposal, opp);
    assert.strictEqual(submitted.state, 'SUBMITTED');
  });

  test('should prevent any changes when proposal is SUBMITTED (immutable)', () => {
    const opp = publishOpportunity(createOpportunity('opp-123'));
    let proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');
    proposal = confirmProposal(proposal, opp, 'vn-user');
    proposal = confirmProposal(proposal, opp, 'ru-user');
    const submitted = submitProposal(proposal, opp);

    // Try to confirm again
    assert.throws(
      () => confirmProposal(submitted, opp, 'vn-user'),
      /Cannot confirm proposal: already SUBMITTED/
    );

    // Try to revise
    assert.throws(
      () => reviseProposal(submitted, opp, 'hacked content', 1),
      /Cannot revise proposal: already SUBMITTED/
    );

    // Try to submit again
    assert.throws(
      () => submitProposal(submitted, opp),
      /Cannot submit proposal: must be in PAIRED_CONFIRMED state/
    );
  });

  test('should fail transitions closed when opportunity is closed', () => {
    let opp = publishOpportunity(createOpportunity('opp-123'));
    let proposal = createProposal('prop-1', opp, 'vn-user', 'ru-user', 'content');

    opp = closeOpportunity(opp);

    // Try to confirm
    assert.throws(
      () => confirmProposal(proposal, opp, 'vn-user'),
      /Cannot confirm proposal: opportunity is not PUBLISHED/
    );

    // Try to revise
    assert.throws(
      () => reviseProposal(proposal, opp, 'new content', 1),
      /Cannot revise proposal: opportunity is not PUBLISHED/
    );

    // Try to submit
    const pairedOpp = publishOpportunity(createOpportunity('opp-456'));
    let pairedProp = createProposal('prop-2', pairedOpp, 'vn-user', 'ru-user', 'content');
    pairedProp = confirmProposal(pairedProp, pairedOpp, 'vn-user');
    pairedProp = confirmProposal(pairedProp, pairedOpp, 'ru-user');

    const closedOpp = closeOpportunity(pairedOpp);
    assert.throws(
      () => submitProposal(pairedProp, closedOpp),
      /Cannot submit proposal: opportunity is not PUBLISHED/
    );
  });
});
