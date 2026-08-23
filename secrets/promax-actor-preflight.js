const fs = require('fs');

const env = Object.fromEntries(
  fs.readFileSync('frontend/.env.local', 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^([^#=]+)=(.*)$/))
    .filter(Boolean)
    .map((match) => [match[1], match[2].replace(/^['"]|['"]$/g, '')]),
);
const inventory = JSON.parse(fs.readFileSync('secrets/account.json', 'utf8'));
const accounts = [];
(function walk(value, inherited = {}) {
  if (Array.isArray(value)) return value.forEach((item) => walk(item, inherited));
  if (!value || typeof value !== 'object') return;
  const next = { ...inherited, ...value };
  if (value.username && value.password && value.role) accounts.push(next);
  for (const child of Object.values(value)) if (child && typeof child === 'object') walk(child, next);
})(inventory);

const required = [
  ['RESEARCHER', 'ORG_001'],
  ['RESEARCHER', 'ORG_002'],
  ['ORGANIZATION_REPRESENTATIVE', 'ORG_001'],
  ['ORGANIZATION_REPRESENTATIVE', 'ORG_002'],
  ['REVIEWER', 'BOARD_001'],
  ['COLLABORATION_MANAGER', 'GLOBAL'],
  ['FOUNDATION_DECISION_MAKER', 'GLOBAL'],
];

async function preflight(role, contextId) {
  const account = accounts.find((item) => item.role === role && item.contextId === contextId);
  if (!account) throw new Error(`missing credential inventory actor ${role}/${contextId}`);
  const tokenResponse = await fetch('http://127.0.0.1:8081/realms/vnru/protocol/openid-connect/token', {
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
  if (!tokenResponse.ok) throw new Error(`token failed ${role}/${contextId}: ${tokenResponse.status}`);
  const { access_token } = await tokenResponse.json();
  const exchange = await fetch('http://127.0.0.1:8080/api/v1/auth/exchange', {
    method: 'POST', headers: { authorization: `Bearer ${access_token}` },
  });
  if (!exchange.ok) throw new Error(`exchange failed ${role}/${contextId}: ${exchange.status}`);
  const { token } = await exchange.json();
  const meResponse = await fetch('http://127.0.0.1:8080/api/v1/auth/me', {
    headers: { cookie: `vnru_session=${encodeURIComponent(token)}` },
  });
  if (!meResponse.ok) throw new Error(`/me failed ${role}/${contextId}: ${meResponse.status}`);
  const me = await meResponse.json();
  if (me.activeContext?.contextId !== contextId) throw new Error(`context mismatch ${role}: ${me.activeContext?.contextId}`);
  const expected = Array.isArray(account.capabilities) ? [...account.capabilities].sort() : null;
  const actual = [...(me.capabilities || [])].sort();
  if (expected && JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error(`capability mismatch ${role}/${contextId}`);
  return {
    role,
    userId: me.userId,
    contextType: me.activeContext?.contextType,
    contextId: me.activeContext?.contextId,
    capabilities: actual.length,
    authenticationLevel: me.authenticationLevel,
  };
}

(async () => {
  const matrix = [];
  for (const [role, contextId] of required) matrix.push(await preflight(role, contextId));
  console.log(JSON.stringify(matrix, null, 2));
})().catch((error) => { console.error(error.message); process.exit(1); });
