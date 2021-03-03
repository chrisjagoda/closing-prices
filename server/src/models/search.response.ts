import { StockPrice } from "types";

export default class SearchResponse {
  stockPrices: StockPrice[];

  constructor(stockPrices: StockPrice[]) {
    this.stockPrices = stockPrices;
  }
}
