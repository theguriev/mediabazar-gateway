import type { H3Event } from "h3";
import type { UserPayload } from "../types/gateway";
import { createProxyOptionsFromPayload } from "./headers";

// Чистая функция для подготовки URL с параметрами
export const prepareProxyTarget = (
  target: string,
  params: Record<string, string>,
  search: string,
): string => {
  const targetWithParams = target.replace(
    /\/:([^/]+)/g,
    (_, key) => `/${params[key] || ""}`,
  );
  return `${targetWithParams}${search}`;
};

// Чистая функция для получения client IP
const getClientIP = (event: H3Event): string => {
  const forwardedFor = getHeader(event, "x-forwarded-for");
  const requestIP = getRequestIP(event);
  return forwardedFor || requestIP || "unknown";
};

// Типы для конфигурации прокси
interface ProxyConfig {
  to?: string;
}

type ProxyTarget = string | ProxyConfig;

// Чистая функция для извлечения URL из конфигурации прокси
const extractProxyUrl = (proxy: ProxyTarget): string | null => {
  if (typeof proxy === "string") {
    return proxy;
  }
  if (proxy && "to" in proxy && proxy.to) {
    return proxy.to;
  }
  return null;
};

// Главная функция для обработки proxy запроса
export const handleProxyRequest = (
  event: H3Event,
  proxy: ProxyTarget,
  userPayload?: UserPayload,
): Promise<Response> => {
  const { search } = getRequestURL(event);
  const params = getRouterParams(event);

  const proxyUrl = extractProxyUrl(proxy);

  if (!proxyUrl) {
    return Promise.resolve(
      new Response("No proxy target defined", { status: 500 }),
    );
  }

  const target = prepareProxyTarget(proxyUrl, params, search);
  const proxyOptions = createProxyOptionsFromPayload(userPayload);

  return proxyRequest(event, target, proxyOptions);
};

// Функция высшего порядка для создания proxy middleware
export const createProxyMiddleware =
  (proxy: ProxyTarget) => (event: H3Event, userPayload?: UserPayload) =>
    handleProxyRequest(event, proxy, userPayload);

// Чистая функция для валидации proxy конфигурации
export const isValidProxyConfig = (proxy: unknown): proxy is ProxyTarget => {
  if (typeof proxy === "string") {
    return proxy.length > 0;
  }
  if (typeof proxy === "object" && proxy !== null) {
    return "to" in proxy && typeof (proxy as ProxyConfig).to === "string";
  }
  return false;
};

// Функция для получения IP клиента (для rate limiting)
export const extractClientIP = getClientIP;
