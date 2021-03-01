import express, { Application } from "express";
import compression from "compression";

import ApiController from "./controllers/api.controller";
import { connect } from "./database/database";
import * as apiValidator from "./validators/api.validator";

export default class App {
  app: Application;
  apiController: ApiController;

  constructor() {
    connect()
    .then(connection => {
      this.apiController = new ApiController(connection);

      this.initializeRoutes();
    }).catch(err => {
      console.error(err);
      process.exit(1);
    });

    this.app = express();

    // Express configuration
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(compression());
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
