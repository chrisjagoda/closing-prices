import { AverageClosingPrice, PercentChangeDay, StockPrice } from "./models";

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
}

export interface PageableResponse {
  pagination: Pagination;
}

export type AverageClosingPriceResponse = AverageClosingPrice

export interface PercentChangeDayResponse extends PageableResponse {
  percentChangeDays: PercentChangeDay[];
}

export interface SearchResponse extends PageableResponse {
  stockPrices: StockPrice[];
}
