export interface Pagination {
  page: number;
  pageSize: number;
}

export interface StockPrice {
  closingPrice?: number;
  companyTicker?: string;
  date?: string;
}

export interface AverageClosingPrice {
  averageClosingPrice: number;
}

export interface PercentChangeDay {
  startDate: string;
  endDate: string;
  startClosingPrice: number;
  endClosingPrice: number;
  companyTickers: string;
  percentChangeDay: number;
}
