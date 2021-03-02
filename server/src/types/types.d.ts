export type SearchRequest = {
  fields?: string,
  by?: string,
  sort?: string,
  company_tickers?: string,
  date?: string,
  limit?: number,
};

export type StockPrice = {
  company_ticker?: string,
  date?: string,
  closing_price?: number
};

export type AverageClosingPriceRequest = {
  company_tickers?: string,
  start: string,
  end: string,
};

export type AverageClosingPrice = {
  averageClosingPrice: number,
}

export type PercentChangeDayRequest = {
  limit?: number,
  sort?: string,
  company_tickers?: string,
};

export type PercentChangeDay = {
  startDate: string,
  endDate: string,
  startClosingPrice: number,
  endClosingPrice: number,
  companyTickers: string,
  percentChangeDay: number,
}
