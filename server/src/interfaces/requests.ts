import { Query } from "express-serve-static-core";

interface RequestQuery extends Query {
  [key: string]: any;
}

interface PageableRequest extends RequestQuery {
  page?: number;
  pageSize?: number;
}

export interface SearchRequest extends PageableRequest {
  fields: string | string[];
  orderBy?: string;
  sort?: string;
  date?: string;
  companyTickers?: string[];
}

export interface AverageClosingPriceRequest extends RequestQuery {
  start: string;
  end: string;
  companyTickers?: string[];
}

export interface PercentChangeDayRequest extends PageableRequest {
  sort?: string;
  companyTickers?: string[];
}
