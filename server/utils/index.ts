// Core gateway functions

// Re-export types for convenience
export type * from "../types/gateway";
// Authentication functions
export { authorize, createAuthMiddleware, isAuthRequired } from "./auth";
export {
  initializeGateway,
  loadRoutesConfig,
  registerRoutes,
} from "./gatewayCore";

// Header management functions
export {
  createProxyHeaders,
  createProxyOptions,
  createProxyOptionsFromPayload,
  getHeadersInfo,
  hasHeaders,
} from "./headers";

// Proxy functions
export {
  createProxyMiddleware,
  extractClientIP,
  handleProxyRequest,
  isValidProxyConfig,
  prepareProxyTarget,
} from "./proxy";
// Rate limiting functions
export {
  checkRateLimit,
  cleanupExpiredEntries,
  getRateLimitStats,
} from "./rateLimit";
