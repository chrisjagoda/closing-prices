import { PercentChangeDay } from "types";
import { 
  AverageClosingPriceRequest, AverageClosingPriceResponse,
  PercentChangeDayRequest, PercentChangeDayResponse,
  SearchRequest, SearchResponse,
} from "../models";

interface ApiServiceInterface {
    search(request: SearchRequest): Promise<Error | SearchResponse>;

    averageClosingPrice(request: AverageClosingPriceRequest): Promise<Error | AverageClosingPriceResponse>;

    percentChangeDay(request: PercentChangeDayRequest): Promise<Error | PercentChangeDayResponse>;
}

export default ApiServiceInterface;