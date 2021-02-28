import express, { Application } from "express";
import compression from "compression";

import ApiController from "./controllers/api.controller";
import * as apiValidator from "./validators/api.validator";

export default class App {
  app: Application;
  apiController: ApiController;

  constructor(apiController: ApiController) {
    this.app = express();
    this.apiController = apiController;
    
    // Express configuration
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(compression());

    this.initializeRoutes();
  }

  /**
   * API routes.
   */
  initializeRoutes() {
    this.app.get("/api/v1/search", apiValidator.search, this.apiController.search);
    this.app.get("/api/v1/averageClosingPrice", apiValidator.averageClosingPrice, this.apiController.averageClosingPrice);
    this.app.get("/api/v1/percentChangeDay", apiValidator.percentChangeDay, this.apiController.percentChangeDay);
  }
}
