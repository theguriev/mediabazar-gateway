import { initializeGateway } from "../utils/gatewayCore";

export default defineNitroPlugin((app) => {
  initializeGateway(app);
});
