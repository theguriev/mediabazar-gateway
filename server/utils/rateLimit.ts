import type { RateLimit, RateLimitEntry } from "../types/gateway";

// Простой in-memory store для рейт лимитов
const rateLimitStore = new Map<string, RateLimitEntry>();

// Чистая функция для создания записи о лимите
const createRateLimitEntry = (resetTime: number): RateLimitEntry => ({
  count: 1,
  resetTime,
});

// Чистая функция для проверки истечения времени
const isExpired = (entry: RateLimitEntry, now: number): boolean =>
  now > entry.resetTime;

// Чистая функция для проверки превышения лимита
const isLimitExceeded = (entry: RateLimitEntry, limit: RateLimit): boolean =>
  entry.count >= limit.requests;

// Чистая функция для создания ключа
const createRateLimitKey = (ip: string): string => ip;

// Чистая функция для инкремента счетчика
const incrementCount = (entry: RateLimitEntry): RateLimitEntry => ({
  ...entry,
  count: entry.count + 1,
});

// Чистая функция для вычисления времени сброса
const calculateResetTime = (now: number, windowSeconds: number): number =>
  now + windowSeconds * 1000;

// Основная функция проверки рейт лимита (использует side effects только для store)
export const checkRateLimit = (ip: string, limit: RateLimit): boolean => {
  const now = Date.now();
  const key = createRateLimitKey(ip);
  const current = rateLimitStore.get(key);

  // Если записи нет или время истекло - создаем новую
  if (!current || isExpired(current, now)) {
    const resetTime = calculateResetTime(now, limit.window);
    rateLimitStore.set(key, createRateLimitEntry(resetTime));
    return true;
  }

  // Если лимит превышен - отклоняем
  if (isLimitExceeded(current, limit)) {
    return false;
  }

  // Инкрементируем счетчик
  rateLimitStore.set(key, incrementCount(current));
  return true;
};

// Чистая функция для очистки истекших записей
export const cleanupExpiredEntries = (): void => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (isExpired(entry, now)) {
      rateLimitStore.delete(key);
    }
  }
};

// Функция для получения статистики (для отладки)
export const getRateLimitStats = () => ({
  totalEntries: rateLimitStore.size,
  entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
    key,
    count: entry.count,
    resetTime: new Date(entry.resetTime).toISOString(),
  })),
});
