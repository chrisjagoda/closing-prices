import { mapCompanyTickers, mapFields } from "../mappers/api.mapper";

export default class SearchRequest {
  by?: string;
  sort?: string;
  date?: string;
  limit?: number;
  companyTickers?: string[];
  fields!: string | string[];

  constructor(by?: string, sort?: string, date?: string, limit?: number, companyTickers?: string, fields?: string) {
    this.by = by;
    this.sort = sort;
    this.date = date;
    this.limit = limit;
    this.companyTickers = mapCompanyTickers(companyTickers);
    this.fields = mapFields(fields);
  }
}
