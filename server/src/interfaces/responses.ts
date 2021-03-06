import { AverageClosingPrice, Pagination, PercentChangeDay, StockPrice } from "./models";

interface PageableResponse {
  pagination: Pagination;
}

export type AverageClosingPriceResponse = AverageClosingPrice

export interface PercentChangeDayResponse extends PageableResponse {
  percentChangeDays: PercentChangeDay[];
}

export interface SearchResponse extends PageableResponse {
  stockPrices: StockPrice[];
}
