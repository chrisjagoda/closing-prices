import { AverageClosingPriceRequest, PercentChangeDayRequest, SearchRequest } from "../interfaces/requests";
import { AverageClosingPrice, StockPrice, PercentChangeDay } from "../interfaces/models";

interface ApiServiceInterface {
  search(request: SearchRequest): Promise<StockPrice[]>;
  averageClosingPrice(request: AverageClosingPriceRequest): Promise<AverageClosingPrice>;
  percentChangeDay(request: PercentChangeDayRequest): Promise<PercentChangeDay[]>;
}

export default ApiServiceInterface;