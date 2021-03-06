import express, { Application } from "express";
import compression from "compression";

import ApiController from "./controllers/api.controller";
import { AverageClosingPriceSchema, PercentChangeDaySchema, SearchSchema } from "./schemas";

export default class App {
  app: Application;
  apiController: ApiController;

  constructor() {
    this.apiController = new ApiController();
    this.app = express();

    // Express configuration
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(compression());

    this.initializeRoutes();
  }

  /**
   * API routes.
   */
  initializeRoutes() {
    this.app.get("/api/v1/search", SearchSchema, this.apiController.search);
    this.app.get("/api/v1/averageClosingPrice", AverageClosingPriceSchema, this.apiController.averageClosingPrice);
    this.app.get("/api/v1/percentChangeDay", PercentChangeDaySchema, this.apiController.percentChangeDay);
  }
}
