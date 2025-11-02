const getUserId = async (event: H3Event<EventHandlerRequest>) => {
  const accessToken = String(getCookie(event, "accessToken"));
  const { secret } = useRuntimeConfig();
  const { sub } = await verifyAccessToken(accessToken, secret);
  return sub;
};

export default getUserId;
