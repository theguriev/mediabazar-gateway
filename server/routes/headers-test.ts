export default eventHandler((event) => {
  const headers = getHeaders(event);

  return {
    success: true,
    headers: {
      "x-user-id": headers["x-user-id"],
      "x-user-email": headers["x-user-email"],
      "x-user-name": headers["x-user-name"],
      "x-user-roles": headers["x-user-roles"],
      "x-user-subject": headers["x-user-subject"],
      "x-token-expires": headers["x-token-expires"],
    },
  };
});
