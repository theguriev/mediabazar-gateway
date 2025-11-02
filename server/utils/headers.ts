import type { ProxyHeaders, UserPayload } from "../types/gateway";

// Pure function for safe string conversion
const safeToString = (value: unknown): string =>
  value !== null && value !== undefined ? String(value) : "";

// Pure function for roles processing
const formatRoles = (roles?: string[] | string): string => {
  if (!roles) {
    return "";
  }
  return Array.isArray(roles) ? roles.join(",") : safeToString(roles);
};

// Payload fields to headers mapping
const headerMappings = [
  { field: "id" as const, header: "X-User-Id" },
  { field: "email" as const, header: "X-User-Email" },
  { field: "name" as const, header: "X-User-Name" },
  { field: "sub" as const, header: "X-User-Subject" },
  { field: "exp" as const, header: "X-Token-Expires" },
] as const;

// Pure function to create base headers
const createBaseHeaders = (payload: UserPayload): ProxyHeaders =>
  headerMappings.reduce((headers, { field, header }) => {
    const value = payload[field];
    if (value !== undefined && value !== null) {
      headers[header] = safeToString(value);
    }
    return headers;
  }, {} as ProxyHeaders);

// Pure function to add roles header
const addRolesHeader = (
  headers: ProxyHeaders,
  roles?: string[] | string,
): ProxyHeaders => {
  const formattedRoles = formatRoles(roles);
  if (formattedRoles) {
    return { ...headers, "X-User-Roles": formattedRoles };
  }
  return headers;
};

// Main function to create headers from payload
export const createProxyHeaders = (payload: UserPayload): ProxyHeaders => {
  const baseHeaders = createBaseHeaders(payload);
  return addRolesHeader(baseHeaders, payload.roles);
};

// Pure function to check if headers exist
export const hasHeaders = (headers: ProxyHeaders): boolean =>
  Object.keys(headers).length > 0;

// Higher-order function to create proxy options
export const createProxyOptions = (headers: ProxyHeaders) =>
  hasHeaders(headers) ? { headers } : undefined;

// Function composition to create proxy options from payload
export const createProxyOptionsFromPayload = (payload?: UserPayload) => {
  if (!payload) {
    return undefined;
  }

  const headers = createProxyHeaders(payload);
  return createProxyOptions(headers);
};

// Pure function to get headers info (for debugging)
export const getHeadersInfo = (headers: ProxyHeaders): string => {
  if (hasHeaders(headers)) {
    return `Proxy headers: ${Object.keys(headers).join(", ")}`;
  }
  return "No proxy headers";
};
