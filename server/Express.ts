import express from "express";

import Locals from "./Locals";
import Routes from "../routes";
import SocketManager from "./SocketManager";

class Express {

  private express: express.Application;

  constructor() {
    this.express = express();
    
    this.mountRoutes();

  }

  public mountRoutes(): void {
    this.express = Routes.mountApi(this.express);
  }

  public init(): void {
    const port = Locals.config().port;

    const server = this.express.listen(port, () => {
      console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
    }).on('error', (error) => {
      console.log('Error', error.message);
    });

    SocketManager.init(server);
  }
}

export default new Express;