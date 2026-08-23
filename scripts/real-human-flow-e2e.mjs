import fs from 'node:fs';
import crypto from 'node:crypto';

const BASE_URL = 'http://127.0.0.1:3000';
const KEYCLOAK_URL = 'http://127.0.0.1:8081/realms/vnru/protocol/openid-connect/token';
const AUTH_EXCHANGE_URL = 'http://127.0.0.1:8080/api/v1/auth/exchange';

// Read accounts from secrets/account.json
const inventory = JSON.parse(fs.readFileSync('secrets/account.json', 'utf8'));
const accounts = [];
(function walk(value) {
  if (Array.isArray(value)) return value.forEach(walk);
  if (!value || typeof value !== 'object') return;
  if (value.username && value.password && value.role) accounts.push(value);
  Object.values(value).forEach(walk);
})(inventory);

// Read env for Keycloak client
const envLines = fs.readFileSync('frontend/.env.local', 'utf8').split(/\r?\n/);
const env = Object.fromEntries(
  envLines.map((line) => line.match(/^([^#=]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^['"]|['"]$/g, '')])
);

async function getSessionToken(role, contextId) {
  const account = accounts.find((item) => item.role === role && (!contextId || item.contextId === contextId));
  if (!account) throw new Error(`Account not found for role ${role} and context ${contextId}`);

  const idpRes = await fetch(KEYCLOAK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      scope: 'openid profile email',
      client_id: env.AUTH_KEYCLOAK_ID,
      client_secret: env.AUTH_KEYCLOAK_SECRET,
      username: account.username,
      password: account.password,
    }),
  });

  if (!idpRes.ok) {
    throw new Error(`Keycloak login failed for ${account.username}: ${idpRes.status} ${await idpRes.text()}`);
  }

  const { access_token } = await idpRes.json();
  const exchangeRes = await fetch(AUTH_EXCHANGE_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${access_token}` },
  });

  if (!exchangeRes.ok) {
    throw new Error(`Session exchange failed for ${account.username}: ${exchangeRes.status} ${await exchangeRes.text()}`);
  }

  const { token } = await exchangeRes.json();
  const meRes = await fetch('http://127.0.0.1:8080/api/v1/auth/me', {
    headers: { cookie: `vnru_session=${encodeURIComponent(token)}` },
  });
  const user = await meRes.json();
  return { token, account, user };
}

function makeClient(sessionToken) {
  return async (path, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      cookie: `vnru_session=${encodeURIComponent(sessionToken)}`,
    };
    if (options.body && typeof options.body === 'object' && !(options.body instanceof URLSearchParams)) {
      headers['content-type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, ok: res.ok, data };
  };
}

async function run() {
  console.log('=== Starting Real Human-Flow E2E Test against Live Stack ===\n');

  // Step 0: Get sessions for all 7 personas
  console.log('>>> [0/10] Authenticating personas against Keycloak & Auth-Service...');
  const { token: managerToken, user: managerUser } = await getSessionToken('COLLABORATION_MANAGER', 'GLOBAL');
  const { token: researcherVnToken, user: resVnUser } = await getSessionToken('RESEARCHER', 'ORG_001');
  const { token: researcherRuToken, user: resRuUser } = await getSessionToken('RESEARCHER', 'ORG_002');
  const { token: orgRepVnToken, user: orgVnUser } = await getSessionToken('ORGANIZATION_REPRESENTATIVE', 'ORG_001');
  const { token: orgRepRuToken, user: orgRuUser } = await getSessionToken('ORGANIZATION_REPRESENTATIVE', 'ORG_002');
  const { token: reviewerToken, user: reviewerUser } = await getSessionToken('REVIEWER', 'BOARD_001');
  const { token: decisionMakerToken, user: dmUser } = await getSessionToken('FOUNDATION_DECISION_MAKER', 'GLOBAL');

  const managerApi = makeClient(managerToken);
  const researcherVnApi = makeClient(researcherVnToken);
  const researcherRuApi = makeClient(researcherRuToken);
  const orgRepVnApi = makeClient(orgRepVnToken);
  const orgRepRuApi = makeClient(orgRepRuToken);
  const reviewerApi = makeClient(reviewerToken);
  const decisionMakerApi = makeClient(decisionMakerToken);
  console.log('✓ All 7 personas authenticated successfully.\n');

  // Step 1: Manager creates and publishes Opportunity
  console.log('>>> [1/10] Manager creates Opportunity Draft & Publishes...');
  const oppId = crypto.randomUUID();
  const oppTitle = `Joint AI Marine Robotics Initiative ${Date.now()}`;
  const createOppRes = await managerApi('/api/collab/opportunities', {
    method: 'POST',
    body: { id: oppId, title: oppTitle, description: 'Bilateral Marine Robotics and Autonomous Submersibles Research' },
  });
  if (!createOppRes.ok) throw new Error(`Failed to create opportunity: ${JSON.stringify(createOppRes.data)}`);
  const opportunity = createOppRes.data;
  console.log(`✓ Opportunity created: ID=${opportunity.id}, State=${opportunity.state}`);

  // Verify Draft persists on query
  const listOppRes = await managerApi('/api/collab/opportunities?limit=50');
  const foundDraft = listOppRes.data.items?.some((item) => item.id === opportunity.id);
  if (!foundDraft) {
    console.log('List status:', listOppRes.status);
    console.log('List items returned:', listOppRes.data.items?.map((i) => ({ id: i.id, state: i.state, title: i.title })));
    throw new Error('Created draft opportunity did not persist in manager list');
  }
  console.log('✓ Verified Opportunity Draft persists in manager query.');

  // Publish Opportunity
  const publishRes = await managerApi(`/api/collab/opportunities/${opportunity.id}/publish`, { method: 'POST' });
  if (!publishRes.ok) throw new Error(`Failed to publish opportunity: ${JSON.stringify(publishRes.data)}`);
  console.log('✓ Opportunity published successfully (State=PUBLISHED).\n');

  // Step 2: Researcher VN creates joint proposal and confirms VN pairing
  console.log('>>> [2/10] Researcher VN creates Proposal and confirms pairing...');
  const propId = crypto.randomUUID();
  const createPropRes = await researcherVnApi('/api/collab/proposals', {
    method: 'POST',
    body: {
      id: propId,
      opportunityId: opportunity.id,
      content: JSON.stringify({
        title: 'Deep-sea Autonomous Navigation in Tropical Waters',
        abstract: 'Bilateral study of adaptive sensor fusion for submersibles.',
        objectives: 'Design and validate robust underwater acoustic telemetry.',
        methodology: 'Joint simulation and deep-sea sea trials in Khanh Hoa and Vladivostok.',
        expectedOutcomes: 'Open-source underwater navigation algorithms and bilateral publications.',
        keywords: ['robotics', 'marine', 'telemetry', 'sensors'],
      }),
      vnParticipant: {
        userId: resVnUser.userId,
        organizationRef: resVnUser.activeContext.contextId,
      },
      ruParticipant: {
        userId: resRuUser.userId,
        organizationRef: resRuUser.activeContext.contextId,
      },
    },
  });
  if (!createPropRes.ok) throw new Error(`Failed to create proposal: ${JSON.stringify(createPropRes.data)}`);
  const proposal = createPropRes.data;
  console.log(`✓ Proposal created: ID=${proposal.id}, State=${proposal.state}`);

  const confirmVnRes = await researcherVnApi(`/api/collab/proposals/${proposal.id}/confirm`, { method: 'POST' });
  if (!confirmVnRes.ok) throw new Error(`VN confirm failed: ${JSON.stringify(confirmVnRes.data)}`);
  console.log('✓ VN pairing confirmed.\n');

  // Step 3: Researcher RU confirms RU pairing
  console.log('>>> [3/10] Researcher RU confirms pairing...');
  const confirmRuRes = await researcherRuApi(`/api/collab/proposals/${proposal.id}/confirm`, { method: 'POST' });
  if (!confirmRuRes.ok) throw new Error(`RU confirm failed: ${JSON.stringify(confirmRuRes.data)}`);
  console.log('✓ RU pairing confirmed. State is now PAIRED_CONFIRMED.\n');

  // Step 4 & 5: VN and RU Org Representatives Endorse
  console.log('>>> [4/10] Organization Representatives Endorse...');
  const endorseVnRes = await orgRepVnApi(`/api/collab/proposals/${proposal.id}/endorse`, { method: 'POST' });
  if (!endorseVnRes.ok) throw new Error(`VN endorsement failed: ${JSON.stringify(endorseVnRes.data)}`);
  console.log('✓ VN Organization representative endorsed.');

  const endorseRuRes = await orgRepRuApi(`/api/collab/proposals/${proposal.id}/endorse`, { method: 'POST' });
  if (!endorseRuRes.ok) throw new Error(`RU endorsement failed: ${JSON.stringify(endorseRuRes.data)}`);
  console.log('✓ RU Organization representative endorsed.\n');

  // Step 6: Researcher submits Proposal
  console.log('>>> [5/10] Researcher VN submits Proposal...');
  const submitPropRes = await researcherVnApi(`/api/collab/proposals/${proposal.id}/submit`, { method: 'POST' });
  if (!submitPropRes.ok) throw new Error(`Proposal submit failed: ${JSON.stringify(submitPropRes.data)}`);
  console.log('✓ Proposal submitted. State is now SUBMITTED.\n');

  // Step 7: Manager screens ELIGIBLE and assigns Reviewer
  console.log('>>> [6/10] Manager screens ELIGIBLE and assigns Reviewer...');
  const screenRes = await managerApi(`/api/collab/proposals/${proposal.id}/screen`, {
    method: 'POST',
    body: { eligible: true, reason: 'Meets bilateral scientific scope and paired criteria.' },
  });
  if (!screenRes.ok) throw new Error(`Screening failed: ${JSON.stringify(screenRes.data)}`);
  console.log('✓ Proposal screened as ELIGIBLE.');

  const assignRes = await managerApi('/api/reviews/assignments', {
    method: 'POST',
    body: {
      proposalRef: proposal.id,
      reviewerId: reviewerUser.userId,
      boardRef: reviewerUser.activeContext.contextId,
    },
  });
  if (!assignRes.ok) throw new Error(`Review assignment failed: ${JSON.stringify(assignRes.data)}`);
  const assignment = assignRes.data;
  console.log(`✓ Reviewer assigned: AssignmentID=${assignment.id}, Status=${assignment.status}\n`);

  // Step 8: Reviewer declares NO_CONFLICT and submits Evaluation
  console.log('>>> [7/10] Reviewer declares NO_CONFLICT and submits evaluation...');
  const getAssignRes = await reviewerApi(`/api/reviews/assignments/${assignment.id}`);
  if (!getAssignRes.ok) throw new Error(`Reviewer failed to read assignment: ${JSON.stringify(getAssignRes.data)}`);
  const fetchedAssignment = getAssignRes.data;
  console.log(`✓ Reviewer read assignment. Snapshot title: "${fetchedAssignment.snapshot?.title}"`);

  // Declare NO_CONFLICT
  const conflictRes = await reviewerApi(`/api/reviews/assignments/${assignment.id}/conflict`, {
    method: 'POST',
    body: { declaration: 'NO_CONFLICT' },
  });
  if (!conflictRes.ok) throw new Error(`Conflict declaration failed: ${JSON.stringify(conflictRes.data)}`);
  console.log('✓ Declared NO_CONFLICT.');

  // Submit evaluation scores
  const submitEvalRes = await reviewerApi(`/api/reviews/assignments/${assignment.id}/evaluation/submit`, {
    method: 'POST',
    body: {
      scientificMerit: 5,
      feasibility: 4,
      bilateralValue: 5,
      impact: 4,
      comments: 'Strong bilateral robotics methodology with clear milestones and sound sea trial plan.',
    },
  });
  if (!submitEvalRes.ok) throw new Error(`Review evaluation submit failed: ${JSON.stringify(submitEvalRes.data)}`);
  console.log('✓ Review evaluation submitted (Status=SUBMITTED).\n');

  // Step 9: Decision Maker inspects aggregated recommendation and issues Decision
  console.log('>>> [8/10] Decision Maker inspects recommendation and approves...');
  const recRes = await decisionMakerApi(`/api/reviews/proposals/${proposal.id}/recommendation`);
  if (!recRes.ok) throw new Error(`Failed to fetch recommendation: ${JSON.stringify(recRes.data)}`);
  const recommendation = recRes.data;
  console.log(`✓ Aggregated Recommendation: Overall=${recommendation.overallAverage}, TotalReviews=${recommendation.totalReviews}`);
  console.log(`  (Merit=${recommendation.averageScientificMerit}, Feasibility=${recommendation.averageFeasibility}, Bilateral=${recommendation.averageBilateralValue}, Impact=${recommendation.averageImpact})`);

  // Issue Approval Decision
  const decisionRes = await decisionMakerApi(`/api/collab/proposals/${proposal.id}/decision`, {
    method: 'POST',
    body: { approved: true, reason: 'Exceptional bilateral research merit and clear implementation roadmap.' },
  });
  if (!decisionRes.ok) throw new Error(`Decision issuance failed: ${JSON.stringify(decisionRes.data)}`);
  const approvedProposal = decisionRes.data;
  const decisionItem = approvedProposal.decisions?.find((d) => d.approved) || approvedProposal.decisions?.[0];
  const decisionRef = decisionItem?.id || proposal.id;
  console.log(`✓ Foundation Decision issued: APPROVED (DecisionRef=${decisionRef}).\n`);

  // Step 10: Bootstrap Project
  console.log('>>> [9/10] Bootstrapping collaborative project...');
  const bootstrapRes = await decisionMakerApi('/api/projects/bootstrap', {
    method: 'POST',
    body: {
      decisionRef,
      proposalRef: proposal.id,
      title: 'Vietnam-Russia Joint Marine Robotics Project',
      leadId: resVnUser.userId,
      approved: true,
    },
  });
  if (!bootstrapRes.ok) throw new Error(`Project bootstrap failed: ${JSON.stringify(bootstrapRes.data)}`);
  const project = bootstrapRes.data;
  console.log(`✓ Project successfully bootstrapped: ProjectID=${project.id}, Title="${project.title}"\n`);

  console.log('>>> [10/10] Verifying Project Access...');
  const getProjectRes = await researcherVnApi(`/api/projects/${project.id}`);
  if (!getProjectRes.ok) throw new Error(`Failed to get project: ${JSON.stringify(getProjectRes.data)}`);
  console.log(`✓ Project verified: ID=${getProjectRes.data.id}, LeadId=${getProjectRes.data.leadId}`);

  console.log('\n======================================================');
  console.log('🎉 FULL REAL HUMAN-FLOW E2E TEST COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
}

run().catch((err) => {
  console.error('\n❌ Human-flow E2E Test FAILED:', err);
  process.exit(1);
});
