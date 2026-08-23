import app from "./app/app.js";
import { config } from "./config/server.config.js";
import { main } from "./db/dbConnect.js";


const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await main();

    console.log("✅ MongoDB connected successfully");

    app.listen(config.port, () => {
      console.log(`🚀 Book Directory Project Running on port ${config.port}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
  }
};


startServer();