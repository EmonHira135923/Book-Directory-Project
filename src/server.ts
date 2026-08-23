import app from "./app/app.js";
import { config } from "./config/server.config.js";


app.listen(config.port, () => {
  console.log(`Book Directory Project Runnings ${config.port}`);
});