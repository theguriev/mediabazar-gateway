type Route = NitroRouteConfig & {
  methods: Array<RouterMethod>;
  authorizationNeeded?: boolean;
  rateLimit?: {
    requests: number;
    window: number; // в секундах
  };
};

// Простой in-memory store для рейт лимитов
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (
  ip: string,
  limit: { requests: number; window: number },
) => {
  const now = Date.now();
  const key = ip;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.window * 1000 });
    return true;
  }

  if (current.count >= limit.requests) {
    return false;
  }

  current.count++;
  return true;
};

const prepareTarget = (
  target: string,
  params: Record<string, string>,
  search: string,
) => {
  return `${target.replace(/\/:([^/]+)/g, (_, key) => `/${params[key] || ""}`)}${search}`;
};

export default defineNitroPlugin((app) => {
  try {
    const { routesFile, secret } = useRuntimeConfig();
    const file = readFileSync(routesFile, "utf-8");
    const routes = safeDestr<{ [path: string]: Route }>(file);

    Object.entries(routes).forEach(
      ([path, { methods, authorizationNeeded, rateLimit, proxy }]) => {
        if (!Array.isArray(methods)) {
          return;
        }
        methods.forEach((unpreparedMethod) => {
          const method = unpreparedMethod.toLowerCase() as RouterMethod;
          if (!(method in app.router)) {
            return;
          }
          app.router.add(
            path,
            defineEventHandler(async (event) => {
              const { search } = getRequestURL(event);
              const params = getRouterParams(event);

              // Проверка рейт лимита
              if (rateLimit) {
                const clientIP =
                  getHeader(event, "x-forwarded-for") ||
                  getRequestIP(event) ||
                  "unknown";
                if (!checkRateLimit(clientIP, rateLimit)) {
                  throw createError({
                    message: "Rate limit exceeded",
                    status: 429,
                    statusMessage: "Too Many Requests",
                  });
                }
              }

              let userPayload: any = null;

              if (authorizationNeeded) {
                const accessToken = getCookie(event, "accessToken");
                if (!accessToken) {
                  throw createError({
                    message: "Access token not found!",
                    status: 404,
                  });
                }

                try {
                  userPayload = await verifyAccessToken(accessToken, secret);
                } catch (_err) {
                  throw createError({
                    message: "Invalid access token!",
                    status: 401,
                  });
                }
              }

              if (proxy) {
                // Подготавливаем дополнительные заголовки из JWT payload
                const additionalHeaders: Record<string, string> = {};

                if (userPayload) {
                  // Добавляем пользовательские данные в заголовки
                  if (userPayload.id) {
                    additionalHeaders["X-User-Id"] = String(userPayload.id);
                  }
                  if (userPayload.email) {
                    additionalHeaders["X-User-Email"] = userPayload.email;
                  }
                  if (userPayload.roles) {
                    additionalHeaders["X-User-Roles"] = Array.isArray(
                      userPayload.roles,
                    )
                      ? userPayload.roles.join(",")
                      : String(userPayload.roles);
                  }
                  if (userPayload.name) {
                    additionalHeaders["X-User-Name"] = userPayload.name;
                  }
                  if (userPayload.sub) {
                    additionalHeaders["X-User-Subject"] = userPayload.sub;
                  }
                  // Добавляем время истечения токена
                  if (userPayload.exp) {
                    additionalHeaders["X-Token-Expires"] = String(
                      userPayload.exp,
                    );
                  }
                }

                const proxyOptions =
                  Object.keys(additionalHeaders).length > 0
                    ? { headers: additionalHeaders }
                    : undefined;

                if (typeof proxy === "string") {
                  return proxyRequest(
                    event,
                    prepareTarget(proxy, params, search),
                    proxyOptions,
                  );
                }
                if ("to" in proxy) {
                  return proxyRequest(
                    event,
                    prepareTarget(proxy.to, params, search),
                    proxyOptions,
                  );
                }
              }
              return new Response("No proxy defined", { status: 500 });
            }),
            method,
          );
        });
      },
    );
  } catch (error) {
    console.error("Initialize error: ", error);
  }
});
