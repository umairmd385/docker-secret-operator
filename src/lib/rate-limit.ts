/**
 * Simple in-memory rate limiting
 * For production, use Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export async function rateLimit(
  key: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const limitKey = `${key}:${action}`;

  const entry = rateLimitMap.get(limitKey);

  if (!entry || now > entry.resetAt) {
    // New window
    rateLimitMap.set(limitKey, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count < limit) {
    entry.count++;
    return { success: true, remaining: limit - entry.count };
  }

  return { success: false, remaining: 0 };
}

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 3600000);
