import { AverageClosingPriceRequest, PercentChangeDayRequest, SearchRequest } from "../interfaces/requests";
import {AverageClosingPriceResponse, PercentChangeDayResponse, SearchResponse } from "../interfaces/responses";

interface ApiServiceInterface {
  search(request: SearchRequest): Promise<SearchResponse>;
  averageClosingPrice(request: AverageClosingPriceRequest): Promise<AverageClosingPriceResponse>;
  percentChangeDay(request: PercentChangeDayRequest): Promise<PercentChangeDayResponse>;
}

export default ApiServiceInterface;