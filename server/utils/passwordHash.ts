const passwordHash = (password: string) =>
  createHash("md5").update(password).digest("hex");

export default passwordHash;
