import { Database } from "sqlite3";

import ApiServiceInterface from "./api.service.interface";
import { StockPrice, PercentChangeDay, AverageClosingPrice } from "types";

export default class ApiService implements ApiServiceInterface {
  private connection: Database;

  constructor(connection: Database) {
    this.connection = connection;
  }

  /**
   * Get stock info
   */
  search(fields: string, by: string, sort: string, limit: number, date: string, company_ticker: string): Promise<Error | StockPrice[]> {
    const _fields = fields || "*";
    const _limit = limit ? `LIMIT ${limit}` : "";
    let _by: string = "";
    if (by) {
      _by = `ORDER BY ${by}`;
      if (sort) {
        _by += ` ${sort}`;
      }
    }

    const WHERE = "WHERE";
    let _query = date ? `${WHERE} date = '${date}'` : "";
    if (company_ticker) {
      const AND = " AND";
      _query += `${date ? AND : WHERE} company_ticker = '${company_ticker}'`;
    }

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT ${_fields} FROM closing_prices
        ${_by}
        ${_limit}
        ${_query};
      `;
      return this.connection.all(sql, (err, rows: StockPrice[]) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      });
    });
  };

  /**
   * Get average closing price over a period of time
   */
  averageClosingPrice(company_ticker: string, start: string, end: string): Promise<Error | AverageClosingPrice> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT AVG(closing_price) as averageClosingPrice FROM closing_prices
        WHERE company_ticker = '${company_ticker}'
        AND date >= '${start}'
        AND date <= '${end}';
      `;
      return this.connection.get(sql, (err, val) => {
        if (err) {
          return reject(err);
        }

        resolve(val);
      });
    });
  };

  /**
   * Get stock closing price percent change from one day to next
   */
  percentChangeDay(limit: number, sort: string): Promise<Error | PercentChangeDay[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          start_date startDate,
          end_date endDate,
          SUM(start_closing_price) startClosingPrice,
          SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) endClosingPrice,
          GROUP_CONCAT(CASE WHEN end_closing_price IS NOT NULL THEN company_ticker END) companyTickers,
          (SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) - SUM(start_closing_price)) / SUM(start_closing_price) percentChangeDay
        FROM
          percent_change_day
        GROUP BY startDate
        ORDER BY percentChangeDay ${sort}
        LIMIT ${limit};
      `;

      return this.connection.all(sql, (err: Error, rows: any[]) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      });
    });
  };
}
