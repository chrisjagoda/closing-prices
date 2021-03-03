import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import ApiService from "../services/api.service";
import { SearchRequest, AverageClosingPriceRequest, PercentChangeDayRequest } from "../models/";
import { AverageClosingPriceQuery, PercentChangeDayQuery, SearchQuery } from "types";

export default class ApiController {
  private apiService: ApiService;

  constructor() {
    this.apiService = new ApiService();
  }

  /**
   * GET /api/v1/search
   * Search API.
   */
  search = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    } else {
      try {
        const { by, sort, date, limit, companyTickers, fields } = req.query as SearchQuery;
        const request = new SearchRequest(by, sort, date, limit, companyTickers, fields);
        const response = await this.apiService.search(request);

        res.send(response);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: ["Internal Server Error."]});
      }
    }

    next();
  }
  
  /**
   * GET /api/v1/averageClosingPrice
   * Average closing price API.
   */
  averageClosingPrice = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    } else {
      try {
        const { start, end, companyTickers } = req.query as AverageClosingPriceQuery;
        const request = new AverageClosingPriceRequest(start, end, companyTickers);
        const response = await this.apiService.averageClosingPrice(request);

        res.send(response);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: ["Internal Server Error."]});
      }
    }

    next();
  }
  
  /**
   * GET /api/v1/percentChangeDay
   * Percent change API.
   */
  percentChangeDay = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    } else {
      try {
        const { limit, sort, companyTickers } = req.query as PercentChangeDayQuery;
        const request = new PercentChangeDayRequest(limit, sort, companyTickers);
        const response = await this.apiService.percentChangeDay(request);

        res.send(response);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: ["Internal Server Error."]});
      }
    }

    next();
  }
}
