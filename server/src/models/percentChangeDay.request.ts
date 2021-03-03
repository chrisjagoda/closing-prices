import { mapCompanyTickers } from "../mappers/api.mapper";

export default class PercentChangeDayRequest {
  limit?: number;
  sort?: string;
  companyTickers?: string[];

  constructor(limit?: number, sort?: string, companyTickers?: string) {
    this.limit = limit;
    this.sort = sort;
    this.companyTickers = mapCompanyTickers(companyTickers);
  }
}
