import { ParamSchema } from "express-validator";

export const sort: ParamSchema = {
  in: "query",
  optional: true,
  notEmpty: {
    errorMessage: "sort must not be empty"
  },
  trim: true,
  matches: {
    options: /(asc)|(desc)/i,
    errorMessage: "sort invalid, available options are asc or desc"
  }
};

export const page: ParamSchema = {
  in: "query",
  optional: true,
  notEmpty: {
    errorMessage: "page must not be empty"
  },
  trim: true,
  isInt: {
    options: { min: 1 },
    errorMessage: "page must be integer between 1 and 1000"
  },
  toInt: true
};

export const pageSize: ParamSchema = {
  in: "query",
  optional: true,
  notEmpty: {
    errorMessage: "pageSize must not be empty"
  },
  trim: true,
  isInt: {
    options: { min: 1, max: 1000 },
    errorMessage: "pageSize must be integer between 1 and 1000"
  },
  toInt: true
};

export const companyTickers: ParamSchema = {
  in: "query",
  optional: true,
  notEmpty: {
    errorMessage: "companyTickers must not be empty"
  },
  trim: true,
  matches: {
    options: /^[-a-zA-Z,]*$/,
    errorMessage: "companyTickers must contain only letters and dashes and be separated by commas"
  },
  customSanitizer: {
    options: (company_tickers: string) => {
      return company_tickers ? company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase()) : null;
    }
  }
};
