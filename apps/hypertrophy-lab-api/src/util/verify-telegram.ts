import crypto from 'crypto';

export function verifyTelegram(q: any) {
  const { hash, ...data } = q;

  const checkStr = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join('\n');

  const secret = crypto.createHash('sha256').update(process.env.TG_BOT_TOKEN!).digest();
  const hmac = crypto.createHmac('sha256', secret).update(checkStr).digest('hex');

  if (hmac !== hash) throw new Error('Invalid Telegram signature');
  if (Date.now() / 1000 - +data.auth_date > 86400)
    // 24 h
    throw new Error('Stale auth data');

  return data; // verified user info
}
