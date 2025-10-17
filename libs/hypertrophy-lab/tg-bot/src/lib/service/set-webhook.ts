export async function setWebhook(p: { token: string; url: string; secret: string }) {
  const r = await fetch(`https://api.telegram.org/bot${p.token}/setWebhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ url: p.url, secret_token: p.secret }),
  });
  return r.json();
}