import { Server } from "./server";
import { SocketServer } from "./socket.server";
import { initDatabase } from "./db/dataSource";

(async () => {
  try {
    await initDatabase();
    const server: Server = Server.bootstrap();
    server.listen();
    const socketServer: SocketServer = SocketServer.bootstrap();
    socketServer.listen(server.getHttpServer());
  } catch (error) {
    throw error;
  }
})();
