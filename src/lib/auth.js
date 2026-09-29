// Universal Web Crypto HMAC helper for Next.js (works in Node.js & Edge Middleware)

const SECRET_KEY = process.env.ADMIN_SECRET || 'dikala-photography-super-secret-key-2026';

async function getKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(username) {
  const enc = new TextEncoder();
  const timestamp = Date.now();
  const data = `${username}:${timestamp}`;
  const key = await getKey();
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // base64 url safe data
  const base64Data = btoa(data);
  return `${base64Data}.${sigHex}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  const [base64Data, sigHex] = token.split('.');
  if (!base64Data || !sigHex) return false;

  try {
    const data = atob(base64Data);
    const [username, timestampStr] = data.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // Expire session after 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - timestamp > SEVEN_DAYS) {
      return false;
    }

    const enc = new TextEncoder();
    const key = await getKey();

    // Convert sigHex back to buffer
    const sigBytes = new Uint8Array(
      sigHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(data)
    );

    return isValid ? { username } : false;
  } catch (err) {
    return false;
  }
}
