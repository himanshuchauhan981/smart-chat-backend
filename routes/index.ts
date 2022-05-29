import { Application } from "express";

import ApiRouter from "./apiRouter";

class Routes {

  public mountApi(express: Application): Application {
    const apiRouter = new ApiRouter();

    const router = apiRouter.prepareRoutes();

    return express.use('/api', router);
  }
}

export default new Routes;
