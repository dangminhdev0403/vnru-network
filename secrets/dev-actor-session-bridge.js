const http = require('http');
const fs = require('fs');

const actor = process.argv[2];
const contextId = process.argv[3];
const target = process.argv[4] || '/workspace/collaboration/opportunities';
if (!actor) process.exit(2);
const env = Object.fromEntries(fs.readFileSync('frontend/.env.local', 'utf8').split(/\r?\n/).map((line) => line.match(/^([^#=]+)=(.*)$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^['"]|['"]$/g, '')]));
const inventory = JSON.parse(fs.readFileSync('secrets/account.json', 'utf8'));
const accounts = [];
(function walk(value) {
  if (Array.isArray(value)) return value.forEach(walk);
  if (!value || typeof value !== 'object') return;
  if (value.username && value.password && value.role) accounts.push(value);
  Object.values(value).forEach(walk);
})(inventory);
const account = accounts.find((item) => item.role === actor && (!contextId || item.contextId === contextId));
if (!account) throw new Error(`Unknown actor ${actor}/${contextId || '*'}`);

async function session() {
  const idp = await fetch('http://127.0.0.1:8081/realms/vnru/protocol/openid-connect/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', scope: 'openid profile email', client_id: env.AUTH_KEYCLOAK_ID, client_secret: env.AUTH_KEYCLOAK_SECRET, username: account.username, password: account.password }),
  });
  if (!idp.ok) throw new Error(`Identity provider rejected actor: ${idp.status}`);
  const { access_token } = await idp.json();
  const exchange = await fetch('http://127.0.0.1:8080/api/v1/auth/exchange', { method: 'POST', headers: { authorization: `Bearer ${access_token}` } });
  if (!exchange.ok) throw new Error(`Session exchange failed: ${exchange.status}`);
  return (await exchange.json()).token;
}

const server = http.createServer(async (request, response) => {
  try {
    const token = await session();
    response.writeHead(302, { 'set-cookie': `vnru_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/`, location: `http://localhost:3000${target}`, 'cache-control': 'no-store' });
    response.end();
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/plain', 'cache-control': 'no-store' });
    response.end(error.message);
  } finally {
    server.close();
  }
});
server.listen(3999, '127.0.0.1', () => console.log('READY'));
