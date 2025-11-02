import type { H3Event } from "h3";
import type { UserPayload } from "../types/gateway";
import { createProxyOptionsFromPayload } from "./headers";

// Pure function to prepare URL with parameters
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

// Pure function to get client IP
const getClientIP = (event: H3Event): string => {
  const forwardedFor = getHeader(event, "x-forwarded-for");
  const requestIP = getRequestIP(event);
  return forwardedFor || requestIP || "unknown";
};

// Types for proxy configuration
interface ProxyConfig {
  to?: string;
}

type ProxyTarget = string | ProxyConfig;

// Pure function to extract URL from proxy configuration
const extractProxyUrl = (proxy: ProxyTarget): string | null => {
  if (typeof proxy === "string") {
    return proxy;
  }
  if (proxy && "to" in proxy && proxy.to) {
    return proxy.to;
  }
  return null;
};

// Main function to handle proxy requests
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

// Higher-order function to create proxy middleware
export const createProxyMiddleware =
  (proxy: ProxyTarget) => (event: H3Event, userPayload?: UserPayload) =>
    handleProxyRequest(event, proxy, userPayload);

// Pure function to validate proxy configuration
export const isValidProxyConfig = (proxy: unknown): proxy is ProxyTarget => {
  if (typeof proxy === "string") {
    return proxy.length > 0;
  }
  if (typeof proxy === "object" && proxy !== null) {
    return "to" in proxy && typeof (proxy as ProxyConfig).to === "string";
  }
  return false;
};

// Function to get client IP (for rate limiting)
export const extractClientIP = getClientIP;
