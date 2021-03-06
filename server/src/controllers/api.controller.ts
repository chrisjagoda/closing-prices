import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import ApiService from "../services/api.service";
import { AverageClosingPriceRequest, PercentChangeDayRequest, SearchRequest } from "../interfaces/requests";
import { AverageClosingPriceResponse, PercentChangeDayResponse, SearchResponse } from "../interfaces/responses";

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
        const { fields, orderBy, sort, page, pageSize, date, companyTickers } = req.query as SearchRequest;
        const response = <SearchResponse>{
          pagination: { page, pageSize },
          stockPrices: await this.apiService.search({ fields, orderBy, sort, page, pageSize, date, companyTickers })
        };

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
        const { start, end, companyTickers } = req.query as AverageClosingPriceRequest;
        const response = <AverageClosingPriceResponse>await this.apiService.averageClosingPrice({ start, end, companyTickers });

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
        const { sort, page, pageSize, companyTickers } = req.query as PercentChangeDayRequest;
        const response = <PercentChangeDayResponse>{
          pagination: { page, pageSize },
          percentChangeDays: await this.apiService.percentChangeDay({ sort, page, pageSize, companyTickers })
        };

        res.send(response);
      } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: ["Internal Server Error."]});
      }
    }

    next();
  }
}
