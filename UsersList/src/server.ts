import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import config from "./config";
import UsersRouter from "./router";
import { corsOptions } from "./utils/utils";
import { errorsHandler } from "./utils/errors/errorHandlers";

export class Server {
  private static _instance: Server;
  private app: express.Application;
  private httpServer: http.Server;
  private constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.httpServer = http.createServer(this.app);
  }

  public static bootstrap(): Server {
    if (!Server._instance) {
      Server._instance = new Server();
    }
    return Server._instance;
  }

  public listen() {
    this.httpServer.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });
  }

  public getHttpServer() {
    return this.httpServer;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(cors(corsOptions));
  }

  private initializeRoutes() {
    this.app.use("/api/users", UsersRouter);
    this.app.use("*", (_req, res) => {
      res.status(404).send("Invalid Route");
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorsHandler);
  }
}
