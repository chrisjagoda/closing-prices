import { mapCompanyTickers } from "../mappers/api.mapper";

export default class AverageClosingPriceRequest {
  start: string;
  end: string;
  companyTickers?: string[];

  constructor(start: string, end: string, companyTickers?: string) {
    this.start = start;
    this.end = end;
    this.companyTickers = mapCompanyTickers(companyTickers);
  }
}
