import type { H3Event } from "h3";
import type { UserPayload } from "../types/gateway";

// Types for authorization results
export interface AuthResult {
  success: boolean;
  payload?: UserPayload;
  error?: string;
}

// Pure function to extract token from cookie
const extractAccessToken = (event: H3Event): string | undefined =>
  getCookie(event, "accessToken");

// Pure function to create success result
const createSuccessResult = (payload: UserPayload): AuthResult => ({
  success: true,
  payload,
});

// Pure function to create error result
const createErrorResult = (error: string): AuthResult => ({
  success: false,
  error,
});

// Pure function for token validation
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

// Main authorization function
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

// Higher-order function to create auth middleware
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

// Pure function to check if authorization is required
export const isAuthRequired = (authorizationNeeded?: boolean): boolean =>
  Boolean(authorizationNeeded);
