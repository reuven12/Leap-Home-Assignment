import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { allowedOrigins } from "./utils/utils";

export class SocketServer {
  private static _instance: SocketServer;
  private io: SocketIOServer;

  private constructor() {
    this.io = new SocketIOServer({
      cors: {
        origin: allowedOrigins,
      },
    });
  }

  public static bootstrap(): SocketServer {
    if (!SocketServer._instance) {
      SocketServer._instance = new SocketServer();
    }
    return SocketServer._instance;
  }

  public listen(httpServer: http.Server) {
    this.io.attach(httpServer);
    this.io.on("connection", () => {
      console.log("socket connected");
    });
  }
  emitNewUser(user: any) {
    this.io.emit("newUser", user);
  }

  emitDeletedUser(userId: number) {
    this.io.emit("deletedUser", userId);
  }

  emitUpdatedUser(user: any) {
    this.io.emit("updatedUser", user);
  }
}
