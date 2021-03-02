import ApiServiceInterface from "./api.service.interface";
import connection from "../database/database";
import { StockPrice, PercentChangeDay, AverageClosingPrice } from "types";

export default class ApiService implements ApiServiceInterface {
  /**
   * Get stock info
   */
  async search(fields: string, by: string, sort: string, limit: number, date: string, company_tickers: string): Promise<Error | StockPrice[]> {
    const queryBuilder = connection<StockPrice>("stock_price");
    const where: any = {};

    if (date) {
      where.date = date;
    }
    if (company_tickers) {
      const split = company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase());

      if (split.length > 1) {
        queryBuilder.whereIn("company_ticker", split);
      } else {
        where.company_ticker = split[0];
      }
    }
    if (Object.keys(where).length > 0) {
      queryBuilder.where(where);
    }
    if (limit) {
      queryBuilder.limit(limit);
    }
    if (by) {
      queryBuilder.orderBy(by, sort || "ASC");
    }

    return await queryBuilder.select(fields || "*");
  };

  /**
   * Get average closing price over a period of time
   */
  async averageClosingPrice(company_tickers: string, start: string, end: string): Promise<Error | AverageClosingPrice> {
    const queryBuilder = connection<StockPrice>("stock_price");

    if (company_tickers) {
      const split = company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase());
      if (split.length > 1) {
        queryBuilder.whereIn("company_ticker", split);
      } else {
        queryBuilder.where("company_ticker", split[0]);
      }
    }

    return await queryBuilder
      .avg("closing_price as averageClosingPrice")
      .andWhere("date", ">=", start)
      .andWhere("date", "<=", end)
      .select("");
  };

  /**
   * Get stock closing price percent change from one day to next
   */
  async percentChangeDay(limit: number, sort: string, company_tickers: string): Promise<Error | PercentChangeDay[]> {
    let where = "";
    if (company_tickers) {
      const split = company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase());
      if (split.length > 1) {
        where = `WHERE company_ticker IN ('${split.join("','")}')`;
      } else {
        where = `WHERE company_ticker = '${split[0]}'`;
      }
    }

    return await connection.raw(`
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
    `, [connection.raw(sort), limit]);
  };
}
