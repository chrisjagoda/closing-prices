import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import ApiService from "../services/api.service";
import { SearchRequest, AverageClosingPriceRequest, PercentChangeDayRequest } from "types";
import { parseCompanyTickers } from "../utils/utils";

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
    const errors = Object.values(validationResult(req).mapped());
    if (errors.length > 0) {
      const status = 400;
      res.status(status).send({ status, errors });
    } else {
      try {
        const { fields, by, sort, limit, date, company_tickers } = req.query as SearchRequest;
        const results = await this.apiService.search(fields, by, sort, limit, date, parseCompanyTickers(company_tickers));
        res.send(results);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({errors: ["Internal Server Error."]});
      }
    }
  
    next();
  }
  
  /**
   * GET /api/v1/averageClosingPrice
   * Average closing price API.
   */
  averageClosingPrice = async (req: Request, res: Response, next: NextFunction) => {
    const errors = Object.values(validationResult(req).mapped());
    if (errors.length > 0) {
      const status = 400;
      res.status(status).send({ status, errors });
    } else {
      try {
        const { company_tickers, start, end } = req.query as AverageClosingPriceRequest;
        const results = await this.apiService.averageClosingPrice(start, end, parseCompanyTickers(company_tickers));
        res.send(results);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({errors: ["Internal Server Error."]});
      }
    }
  
    next();
  }
  
  /**
   * GET /api/v1/percentChangeDay
   * Percent change API.
   */
  percentChangeDay = async (req: Request, res: Response, next: NextFunction) => {
    const errors = Object.values(validationResult(req).mapped());
    if (errors.length > 0) {
      const status = 400;
      res.status(status).send({ status, errors });
    } else {
      try {
        const { limit, sort, company_tickers } = req.query as PercentChangeDayRequest;
        const results = await this.apiService.percentChangeDay(limit, sort, parseCompanyTickers(company_tickers));
        res.send(results);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({errors: ["Internal Server Error."]});
      }
    }
  
    next();
  }
}
