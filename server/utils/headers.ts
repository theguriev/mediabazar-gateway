import type { ProxyHeaders, UserPayload } from "../types/gateway";

// Чистая функция для безопасного преобразования в строку
const safeToString = (value: unknown): string =>
  value !== null && value !== undefined ? String(value) : "";

// Чистая функция для обработки ролей
const formatRoles = (roles?: string[] | string): string => {
  if (!roles) {
    return "";
  }
  return Array.isArray(roles) ? roles.join(",") : safeToString(roles);
};

// Мапинг полей payload в заголовки
const headerMappings = [
  { field: "id" as const, header: "X-User-Id" },
  { field: "email" as const, header: "X-User-Email" },
  { field: "name" as const, header: "X-User-Name" },
  { field: "sub" as const, header: "X-User-Subject" },
  { field: "exp" as const, header: "X-Token-Expires" },
] as const;

// Чистая функция для создания базовых заголовков
const createBaseHeaders = (payload: UserPayload): ProxyHeaders =>
  headerMappings.reduce((headers, { field, header }) => {
    const value = payload[field];
    if (value !== undefined && value !== null) {
      headers[header] = safeToString(value);
    }
    return headers;
  }, {} as ProxyHeaders);

// Чистая функция для добавления заголовка ролей
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

// Основная функция для создания заголовков из payload
export const createProxyHeaders = (payload: UserPayload): ProxyHeaders => {
  const baseHeaders = createBaseHeaders(payload);
  return addRolesHeader(baseHeaders, payload.roles);
};

// Чистая функция для проверки наличия заголовков
export const hasHeaders = (headers: ProxyHeaders): boolean =>
  Object.keys(headers).length > 0;

// Функция высшего порядка для создания опций прокси
export const createProxyOptions = (headers: ProxyHeaders) =>
  hasHeaders(headers) ? { headers } : undefined;

// Композиция функций для создания опций прокси из payload
export const createProxyOptionsFromPayload = (payload?: UserPayload) => {
  if (!payload) {
    return undefined;
  }

  const headers = createProxyHeaders(payload);
  return createProxyOptions(headers);
};

// Чистая функция для логирования заголовков (для отладки)
export const getHeadersInfo = (headers: ProxyHeaders): string => {
  if (hasHeaders(headers)) {
    return `Proxy headers: ${Object.keys(headers).join(", ")}`;
  }
  return "No proxy headers";
};
