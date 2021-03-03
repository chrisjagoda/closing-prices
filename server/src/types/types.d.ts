export interface SearchQuery {
  by?: string;
  sort?: string;
  date?: string;
  limit?: number;
  companyTickers?: string;
  fields?: string;
}

export interface StockPrice {
  closingPrice?: number;
  companyTicker?: string;
  date?: string;
}

export interface AverageClosingPriceQuery {
  start?: string;
  end?: string;
  companyTickers?: string;
}

export interface AverageClosingPrice {
  averageClosingPrice: number;
}

export interface PercentChangeDayQuery {
  limit?: number;
  sort?: string;
  companyTickers?: string;
}

export interface PercentChangeDay {
  startDate: string;
  endDate: string;
  startClosingPrice: number;
  endClosingPrice: number;
  companyTickers: string;
  percentChangeDay: number;
}
