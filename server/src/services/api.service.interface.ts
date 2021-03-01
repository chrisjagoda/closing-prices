import { AverageClosingPrice, PercentChangeDay, StockPrice } from "types";

interface ApiServiceInterface {
    search(fields: string, by: string, sort: string, limit: number, date: string, company_ticker: string): Promise<Error | StockPrice[]>;

    averageClosingPrice(company_ticker: string, start: string, end: string): Promise<Error | AverageClosingPrice>;

    percentChangeDay(limit: number, sort: string): Promise<Error | PercentChangeDay[]>;
}

export default ApiServiceInterface;