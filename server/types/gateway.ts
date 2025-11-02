import type { RouterMethod } from "h3";
import type { NitroRouteConfig } from "nitropack";

export interface RateLimit {
  requests: number;
  window: number; // in seconds
}

export interface Route extends NitroRouteConfig {
  methods: Array<RouterMethod>;
  authorizationNeeded?: boolean;
  rateLimit?: RateLimit;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface UserPayload {
  id?: string | number;
  email?: string;
  name?: string;
  sub?: string;
  roles?: string[] | string;
  exp?: number;
  [key: string]: any;
}

export interface ProxyHeaders {
  [key: string]: string;
}

export interface GatewayConfig {
  routesFile: string;
  secret: string;
}

export type RoutesConfig = Record<string, Route>;
