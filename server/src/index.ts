import "dotenv/config";
import { app } from "./app.js";
import { appConfig } from "./config/appConfig.js";

app.listen(appConfig.port, () => {
  console.log(`Firewall sim server running on http://localhost:${appConfig.port}`);
});
