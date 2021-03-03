import ApiServiceInterface from "./api.service.interface";
import connection from "../database/database";
import {
  AverageClosingPriceRequest, AverageClosingPriceResponse,
  PercentChangeDayRequest, PercentChangeDayResponse,
  SearchRequest, SearchResponse
} from "../models/";
import { AverageClosingPrice, PercentChangeDay, StockPrice } from "types";

export default class ApiService implements ApiServiceInterface {
  /**
   * Get stock info
   */
  async search({ by, sort, limit, date, companyTickers, fields }: SearchRequest): Promise<Error | SearchResponse> {
    const queryBuilder = connection<StockPrice>("stock_price");
    const where: any = {};

    if (date) {
      where.date = date;
    }
    if (companyTickers) {
      if (companyTickers.length === 1) {
        where.company_ticker = companyTickers[0];
      } else {
        queryBuilder.whereIn("company_ticker", companyTickers);
      }
    }
    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }
    if (limit) {
      queryBuilder.limit(limit);
    }
    if (by) {
      queryBuilder.orderBy(by, sort);
    }

    return new SearchResponse(await queryBuilder.select(fields));
  }

  /**
   * Get average closing price over a period of time
   */
  async averageClosingPrice({ start, end, companyTickers }: AverageClosingPriceRequest): Promise<Error | AverageClosingPriceResponse> {
    const queryBuilder = connection<AverageClosingPrice>("stock_price");

    if (companyTickers) {
      if (companyTickers.length === 1) {
        queryBuilder.where("company_ticker", companyTickers[0]);
      } else {
        queryBuilder.whereIn("company_ticker", companyTickers);
      }
    }

    return await queryBuilder
      .avg("closing_price as averageClosingPrice")
      .andWhere("date", ">=", start)
      .andWhere("date", "<=", end)
      .select("");
  }

  /**
   * Get stock closing price percent change from one day to next
   */
  async percentChangeDay({ limit, sort, companyTickers }: PercentChangeDayRequest): Promise<Error | PercentChangeDayResponse> {
    let where = "";

    if (companyTickers) {
      if (companyTickers.length === 1) {
        where = `WHERE company_ticker = '${companyTickers[0]}'`;
      } else {
        where = `WHERE company_ticker IN ('${companyTickers.join("','")}')`;
      }
    }

    return new PercentChangeDayResponse(await connection.raw<PercentChangeDay[]>(`
      SELECT
        start_date startDate,
        end_date endDate,
        SUM(start_closing_price) startClosingPrice,
        SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) endClosingPrice,
        GROUP_CONCAT(CASE WHEN end_closing_price IS NOT NULL THEN company_ticker END) companyTickers,
        (SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) - SUM(start_closing_price)) / SUM(start_closing_price) percentChangeDay
      FROM
        change_day
      ${where}
      GROUP BY startDate
      ORDER BY percentChangeDay ?
      LIMIT ?;
    `, [connection.raw(sort), limit]));
  }
}
