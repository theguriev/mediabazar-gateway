import type { RateLimit, RateLimitEntry } from "../types/gateway";

// Simple in-memory store for rate limits
const rateLimitStore = new Map<string, RateLimitEntry>();

// Pure function to create a rate limit entry
const createRateLimitEntry = (resetTime: number): RateLimitEntry => ({
  count: 1,
  resetTime,
});

// Pure function to check if entry is expired
const isExpired = (entry: RateLimitEntry, now: number): boolean =>
  now > entry.resetTime;

// Pure function to check if limit is exceeded
const isLimitExceeded = (entry: RateLimitEntry, limit: RateLimit): boolean =>
  entry.count >= limit.requests;

// Pure function to create rate limit key
const createRateLimitKey = (ip: string): string => ip;

// Pure function to increment counter
const incrementCount = (entry: RateLimitEntry): RateLimitEntry => ({
  ...entry,
  count: entry.count + 1,
});

// Pure function to calculate reset time
const calculateResetTime = (now: number, windowSeconds: number): number =>
  now + windowSeconds * 1000;

// Main rate limit check function (uses side effects only for store)
export const checkRateLimit = (ip: string, limit: RateLimit): boolean => {
  const now = Date.now();
  const key = createRateLimitKey(ip);
  const current = rateLimitStore.get(key);

  // If no record exists or time expired - create new entry
  if (!current || isExpired(current, now)) {
    const resetTime = calculateResetTime(now, limit.window);
    rateLimitStore.set(key, createRateLimitEntry(resetTime));
    return true;
  }

  // If limit exceeded - reject
  if (isLimitExceeded(current, limit)) {
    return false;
  }

  // Increment counter
  rateLimitStore.set(key, incrementCount(current));
  return true;
};

// Pure function to cleanup expired entries
export const cleanupExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (isExpired(entry, now)) {
      rateLimitStore.delete(key);
    }
  }
};

// Function to get statistics (for debugging)
export const getRateLimitStats = () => ({
  totalEntries: rateLimitStore.size,
  entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
    key,
    count: entry.count,
    resetTime: new Date(entry.resetTime).toISOString(),
  })),
});
