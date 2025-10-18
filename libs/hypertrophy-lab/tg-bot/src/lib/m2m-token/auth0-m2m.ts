import { BotEnv } from '@ikigaidev/contracts';

let cached: { token: string; exp: number } | null = null;

// const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE } = loadEnv();

export async function getM2MToken(env: BotEnv) {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 30 > now) return cached.token; // 30s leeway

  const res = await fetch(`https://${env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: env.AUTH0_CLIENT_ID,
      client_secret: env.AUTH0_CLIENT_SECRET,
      audience: env.AUTH0_AUDIENCE,
    }),
  });
  if (!res.ok) throw new Error(`oauth/token ${res.status}`);
  const j: { access_token: string; expires_in: number } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cached = { token: j.access_token, exp: now + j.expires_in };
  return cached.token;
}
