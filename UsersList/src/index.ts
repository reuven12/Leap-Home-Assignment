import { DataSource } from "typeorm";
import config from "./config";
import { Server } from "./server";

(async () => {
  const usersData = new DataSource(config.db);
  try {
    const server: Server = Server.bootstrap();
    server.listen();
    await usersData.initialize();
    console.log("Server started successfully!");
  } catch (error) {
    console.log("ERROR while trying to start Server");
  }
})();
