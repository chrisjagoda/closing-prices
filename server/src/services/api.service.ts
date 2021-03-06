import ApiServiceInterface from "./api.service.interface";
import connection from "../database";
import { AverageClosingPrice, PercentChangeDay, StockPrice } from "../interfaces/models";
import { AverageClosingPriceRequest, PercentChangeDayRequest, SearchRequest } from "../interfaces/requests";

export default class ApiService implements ApiServiceInterface {
  /**
   * Get stock info
   */
  async search({ fields, orderBy, sort, page, pageSize, date, companyTickers }: SearchRequest): Promise<StockPrice[]> {
    const queryBuilder = connection<StockPrice>("stock_price");
    const _where: any = {};

    if (date) {
      _where.date = date;
    }
    if (companyTickers) {
      if (companyTickers.length === 1) {
        _where.company_ticker = companyTickers[0];
      } else {
        queryBuilder.whereIn("company_ticker", companyTickers);
      }
    }
    if (Object.keys(_where).length > 0) {
      queryBuilder.where(_where);
    }
    if (page && pageSize) {
      queryBuilder.limit(pageSize);

      if (page > 1) {
        queryBuilder.offset((page - 1) * pageSize);
      }
    }
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sort);
    }

    return await queryBuilder.select(fields);
  }

  /**
   * Get average closing price over a period of time
   */
  async averageClosingPrice({ start, end, companyTickers }: AverageClosingPriceRequest): Promise<AverageClosingPrice> {
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
  async percentChangeDay({ sort, page, pageSize, companyTickers }: PercentChangeDayRequest): Promise<PercentChangeDay[]> {
    let _where = "";
    let _sort = "";
    let _limit = "";
    let _offset = "";
    const parameters = [];

    if (companyTickers) {
      if (companyTickers.length === 1) {
        _where = `WHERE company_ticker = '${companyTickers[0]}'`;
      } else {
        _where = `WHERE company_ticker IN ('${companyTickers.join("','")}')`;
      }
    }
    if (sort) {
      _sort = " ?";
      parameters.push(connection.raw(sort));
    }
    if (page && pageSize) {
      _limit = "LIMIT ?";
      parameters.push(pageSize);

      if (page > 1) {
        _offset = "OFFSET ?"
        parameters.push((page - 1) * pageSize);
      }
    }

    return await connection.raw<PercentChangeDay[]>(`
      SELECT
        start_date as startDate,
        end_date as endDate,
        SUM(start_closing_price) as startClosingPrice,
        SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) as endClosingPrice,
        GROUP_CONCAT(CASE WHEN end_closing_price IS NOT NULL THEN company_ticker END) as companyTickers,
        (SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) - SUM(start_closing_price)) / SUM(start_closing_price) as percentChangeDay
      FROM
        change_day
      ${_where}
      GROUP BY startDate
      ORDER BY percentChangeDay
      ${_sort}
      ${_limit}
      ${_offset};
    `, parameters);
  }
}
