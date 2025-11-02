import type { H3Event } from "h3";
import type { UserPayload } from "../types/gateway";

// Типы для результатов авторизации
export interface AuthResult {
  success: boolean;
  payload?: UserPayload;
  error?: string;
}

// Чистая функция для извлечения токена из куки
const extractAccessToken = (event: H3Event): string | undefined =>
  getCookie(event, "accessToken");

// Чистая функция для создания успешного результата
const createSuccessResult = (payload: UserPayload): AuthResult => ({
  success: true,
  payload,
});

// Чистая функция для создания результата с ошибкой
const createErrorResult = (error: string): AuthResult => ({
  success: false,
  error,
});

// Чистая функция для валидации токена
const validateToken = async (
  token: string,
  secret: string,
): Promise<UserPayload> => {
  try {
    return await verifyAccessToken(token, secret);
  } catch (_error) {
    throw new Error("Invalid access token");
  }
};

// Основная функция авторизации
export const authorize = async (
  event: H3Event,
  secret: string,
): Promise<AuthResult> => {
  const token = extractAccessToken(event);

  if (!token) {
    return createErrorResult("Access token not found");
  }

  try {
    const payload = await validateToken(token, secret);
    return createSuccessResult(payload);
  } catch (error) {
    return createErrorResult(
      error instanceof Error ? error.message : "Authorization failed",
    );
  }
};

// Функция высшего порядка для создания middleware авторизации
export const createAuthMiddleware =
  (secret: string) =>
  async (event: H3Event): Promise<UserPayload> => {
    const result = await authorize(event, secret);

    if (!result.success) {
      throw createError({
        message: result.error || "Authorization failed",
        status: result.error === "Access token not found" ? 404 : 401,
      });
    }

    return result.payload!;
  };

// Чистая функция для проверки необходимости авторизации
export const isAuthRequired = (authorizationNeeded?: boolean): boolean =>
  Boolean(authorizationNeeded);
