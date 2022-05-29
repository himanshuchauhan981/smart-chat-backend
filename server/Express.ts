import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import Locals from "./Locals";
import Routes from "../routes";
import SocketManager from "./SocketManager";
import errorHandler from "../middleware/error-handler.middleware";

class Express {

  private express: express.Application;

  constructor() {
    this.express = express();
  }

  private mountRoutes(): void {
    this.express = Routes.mountApi(this.express);
  }

  private mountSettings(): void {
    this.express.use(cors());
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(bodyParser.json());
  }

  private mountErrorHandler(): void {
    this.express.use(errorHandler);
  }

  public init(): void {
    const port = Locals.config().port;

    this.mountSettings();

    this.mountRoutes();

    this.mountErrorHandler();

    const server = this.express.listen(port, () => {
      console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
    }).on('error', (error) => {
      console.log('Error', error.message);
    });

    SocketManager.init(server);
  }
}

export default new Express;