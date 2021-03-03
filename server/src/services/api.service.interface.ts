import { AverageClosingPrice, PercentChangeDay, StockPrice } from "types";

interface ApiServiceInterface {
    search(fields: string, by: string, sort: string, limit: number, date: string, company_tickers: string[]): Promise<Error | StockPrice[]>;

    averageClosingPrice(start: string, end: string, company_tickers: string[]): Promise<Error | AverageClosingPrice>;

    percentChangeDay(limit: number, sort: string, company_tickers: string[]): Promise<Error | PercentChangeDay[]>;
}

export default ApiServiceInterface;