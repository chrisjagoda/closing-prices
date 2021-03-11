import ApiServiceInterface from "./api.service.interface";
import connection from "../database";
import { AverageClosingPrice, PercentChangeDay, StockPrice } from "../interfaces/models";
import { AverageClosingPriceRequest, PercentChangeDayRequest, SearchRequest } from "../interfaces/requests";
import { AverageClosingPriceResponse, Pagination, PercentChangeDayResponse, SearchResponse } from "../interfaces/responses";

export default class ApiService implements ApiServiceInterface {
  /**
   * Get stock info
   */
  async search({ fields, orderBy, sort, page, pageSize, date, companyTickers }: SearchRequest): Promise<SearchResponse> {
    const queryBuilder = connection("stock_price");
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
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sort);
    }

    let pagination: Pagination;
    let stockPrices: StockPrice[];
    if (page && pageSize) {
      queryBuilder.limit(pageSize);

      if (page > 1) {
        queryBuilder.offset((page - 1) * pageSize);
      }

      await connection.transaction(async trx => {
        stockPrices = await queryBuilder.select(fields)
          .transacting(trx);

        queryBuilder.clear("limit");
        queryBuilder.clear("offset");
        queryBuilder.clear("order");
        queryBuilder.clear("select");
        const count = await queryBuilder.count("*")
          .transacting(trx);
        const pageCount = Math.ceil(Object.values(count[0])[0] as number / pageSize);
        pagination = {
          page,
          pageCount,
          pageSize
        };
      });
    } else {
      stockPrices = await queryBuilder.select(fields);
      pagination = {
        page: 1,
        pageCount: 1,
        pageSize: stockPrices.length
      };
    }

    return {
      pagination,
      stockPrices
    };
  }

  /**
   * Get average closing price over a period of time
   */
  async averageClosingPrice({ start, end, companyTickers }: AverageClosingPriceRequest): Promise<AverageClosingPriceResponse> {
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
  async percentChangeDay({ sort, page, pageSize, companyTickers }: PercentChangeDayRequest): Promise<PercentChangeDayResponse> {
    let _where = "";
    let _sort = "";
    const parameters: any[] = [];
    const selectFrom = `
      SELECT
        start_date as startDate,
        end_date as endDate,
        SUM(start_closing_price) as startClosingPrice,
        SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) as endClosingPrice,
        GROUP_CONCAT(CASE WHEN end_closing_price IS NOT NULL THEN company_ticker END) as companyTickers,
        (SUM(CASE WHEN end_closing_price IS NOT NULL THEN end_closing_price ELSE 0 END) - SUM(start_closing_price)) / SUM(start_closing_price) as percentChangeDay
      FROM
        change_day
    `;
    const groupByOrderBy = `
      GROUP BY startDate
      ORDER BY percentChangeDay
    `;

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

    let pagination;
    let percentChangeDays;
    if (page && pageSize) {
      const _limit = "LIMIT ?";
      let _offset = "";
      parameters.push(pageSize);

      if (page > 1) {
        _offset = "OFFSET ?";
        parameters.push((page - 1) * pageSize);
      }
      await connection.transaction(async trx => {
        percentChangeDays = await connection.raw(`
          ${selectFrom}
          ${_where}
          ${groupByOrderBy}
          ${_sort}
          ${_limit}
          ${_offset};
        `, parameters)
          .transacting(trx);
        
        const count = await connection.raw(`
          SELECT
            COUNT(*)
          FROM (
            SELECT
              start_date
            FROM
              change_day
            ${_where}
            GROUP BY start_date
          );
        `)
          .transacting(trx);
        const pageCount = Math.ceil(Object.values(count[0])[0] as number / pageSize);
        pagination = {
          page,
          pageCount,
          pageSize
        };
      });
    } else {
      percentChangeDays = await connection.raw(`
        ${selectFrom}
        ${_where}
        ${groupByOrderBy}
        ${_sort};
      `, parameters);
      pagination = {
        page,
        pageCount: 1,
        pageSize: percentChangeDays.length
      };
    }

    return {
      pagination,
      percentChangeDays
    };
  }
}
