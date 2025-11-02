const verifyAccessToken = async (
  token: string,
  secret: string,
): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
};

export default verifyAccessToken;
