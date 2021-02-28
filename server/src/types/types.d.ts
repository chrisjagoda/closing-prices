export type StockPrice = {
  company_ticker?: string,
  date?: string,
  closing_price?: number
};

export type SearchRequest = {
  fields?: string,
  by?: string,
  sort?: string,
  company_ticker?: string,
  date?: string,
  limit?: number,
};

export type AverageClosingPriceRequest = {
  company_ticker: string,
  start: string,
  end: string,
};

export type AverageClosingPrice = {
  averageClosingPrice: number
}

export type PercentChangeDayRequest = {
  limit?: number,
  sort?: string,
};

export type PercentChangeDay = {
  startDate: string,
  endDate: string,
  startClosingPrice: number,
  endClosingPrice: number,
  companyTickers: string,
  percentChangeDay: number
}
