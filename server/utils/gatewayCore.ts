import type { H3Event, RouterMethod } from "h3";
import type { NitroApp } from "nitropack";
import type { Route, RoutesConfig, UserPayload } from "../types/gateway";
import { authorize, isAuthRequired } from "./auth";
import {
  extractClientIP,
  handleProxyRequest,
  isValidProxyConfig,
} from "./proxy";
import { checkRateLimit } from "./rateLimit";

// Чистая функция для валидации метода
const isValidMethod = (method: string, app: NitroApp): method is RouterMethod =>
  method in app.router;

// Чистая функция для создания обработчика маршрута
const createRouteHandler = (route: Route, secret: string) =>
  defineEventHandler(async (event: H3Event) => {
    // Проверка рейт лимита
    if (route.rateLimit) {
      const clientIP = extractClientIP(event);
      if (!checkRateLimit(clientIP, route.rateLimit)) {
        throw createError({
          message: "Rate limit exceeded",
          status: 429,
          statusMessage: "Too Many Requests",
        });
      }
    }

    // Авторизация
    let userPayload: UserPayload | undefined;

    if (isAuthRequired(route.authorizationNeeded)) {
      const authResult = await authorize(event, secret);
      if (!authResult.success) {
        throw createError({
          message: authResult.error || "Authorization failed",
          status: authResult.error === "Access token not found" ? 404 : 401,
        });
      }
      userPayload = authResult.payload;
    }

    // Proxy обработка
    if (route.proxy && isValidProxyConfig(route.proxy)) {
      return handleProxyRequest(event, route.proxy, userPayload);
    }

    return new Response("No proxy defined", { status: 500 });
  });

// Функция для регистрации одного маршрута
const registerRoute = (
  app: NitroApp,
  path: string,
  route: Route,
  secret: string,
): void => {
  if (!Array.isArray(route.methods)) {
    return;
  }

  const handler = createRouteHandler(route, secret);

  route.methods.forEach((unpreparedMethod) => {
    const method = unpreparedMethod.toLowerCase();
    if (isValidMethod(method, app)) {
      app.router.add(path, handler, method);
    }
  });
};

// Функция для регистрации всех маршрутов
export const registerRoutes = (
  app: NitroApp,
  routes: RoutesConfig,
  secret: string,
): void => {
  Object.entries(routes).forEach(([path, route]) => {
    registerRoute(app, path, route, secret);
  });
};

// Чистая функция для загрузки конфигурации маршрутов
export const loadRoutesConfig = (filePath: string): RoutesConfig => {
  try {
    const file = readFileSync(filePath, "utf-8");
    const routes = safeDestr<RoutesConfig>(file);
    return routes || {};
  } catch (error) {
    throw new Error(
      `Failed to load routes config: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Главная функция инициализации gateway
export const initializeGateway = (app: NitroApp): void => {
  try {
    const { routesFile, secret } = useRuntimeConfig();
    const routes = loadRoutesConfig(routesFile);
    registerRoutes(app, routes, secret);
  } catch (error) {
    // Gateway initialization failed - это критическая ошибка
    throw new Error(
      `Gateway initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
