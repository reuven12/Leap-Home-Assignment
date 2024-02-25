import express from 'express';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import config from './config';
import UsersRouter from './router';
import { corsOptions } from './utils/utils';
import { errorsHandler } from './utils/errors/errorHandlers';

export class Server {
  private static _instance: Server;
  private app: express.Application;
  private constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public static bootstrap(): Server {
    if (!Server._instance) {
      Server._instance = new Server();
    }
    return Server._instance;
  }

  public listen() {
    this.app.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(morgan('dev'));
    this.app.use(cors(corsOptions));
  }

  private initializeRoutes() {
    this.app.use('/api',UsersRouter);
    this.app.use('*', (_req, res) => {
      res.status(404).send('Invalid Route');
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorsHandler);
  }
}
