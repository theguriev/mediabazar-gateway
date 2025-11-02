const issueAccessToken = async (
  payload: JWTPayload,
  { secret, expiresIn = "15m" }: { secret: string; expiresIn?: string },
) => {
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn);

  return await jwt.sign(new TextEncoder().encode(secret));
};

export default issueAccessToken;
