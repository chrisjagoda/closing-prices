import ApiServiceInterface from "./api.service.interface";
import connection from "../database/database";
import { StockPrice, PercentChangeDay, AverageClosingPrice } from "types";

export default class ApiService implements ApiServiceInterface {
  /**
   * Get stock info
   */
  async search(fields: string, by: string, sort: string, limit: number, date: string, company_ticker: string): Promise<Error | StockPrice[]> {
    const queryBuilder = connection<StockPrice>("stock_price");

    let where = {};
    if (date) {
      where = { ...where, date };
    }
    if (company_ticker) {
      where = { ...where, company_ticker };
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

    try {
      return await queryBuilder.select(fields || "*");
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Get average closing price over a period of time
   */
  averageClosingPrice(company_ticker: string, start: string, end: string): Promise<Error | AverageClosingPrice> {
    return new Promise((resolve, reject) => {
      // const sql = `
      //   SELECT AVG(closing_price) as averageClosingPrice FROM closing_prices
      //   WHERE company_ticker = '${company_ticker}'
      //   AND date >= '${start}'
      //   AND date <= '${end}';
      // `;
      // return connection.get(sql, (err, val) => {
      //   if (err) {
      //     return reject(err);
      //   }

      //   resolve(val);
      // });
    });
  };

  /**
   * Get stock closing price percent change from one day to next
   */
  percentChangeDay(limit: number, sort: string): Promise<Error | PercentChangeDay[]> {
    return new Promise((resolve, reject) => {
      // const sql = `
      //   SELECT
      //     start_date startDate,
      //     end_date endDate,
      //     SUM(start_closing_price) startClosingPrice,
      //     SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) endClosingPrice,
      //     GROUP_CONCAT(CASE WHEN end_closing_price IS NOT NULL THEN company_ticker END) companyTickers,
      //     (SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) - SUM(start_closing_price)) / SUM(start_closing_price) percentChangeDay
      //   FROM
      //     percent_change_day
      //   GROUP BY startDate
      //   ORDER BY percentChangeDay ${sort}
      //   LIMIT ${limit};
      // `;

      // return connection.all(sql, (err: Error, rows: any[]) => {
      //   if (err) {
      //     return reject(err);
      //   }

      //   resolve(rows);
      // });
    });
  };
}
