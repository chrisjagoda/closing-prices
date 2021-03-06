import { checkSchema } from "express-validator";

import { STOCK_PRICE_FIELDS } from "../constants";
import { companyTickers, page, pageSize } from "../schemas/shared.schema";

const fieldsMap: { [key: string]: string } = {
  companyTicker: "company_ticker as companyTicker",
  closingPrice: "closing_price as closingPrice",
};

const SearchSchema = checkSchema({
  fields: {
    in: "query",
    optional: true,
    notEmpty: {
      errorMessage: "fields must not be empty"
    },
    trim: true,
    custom: {
      options: (value: string) => {
        const availableFields = new Set(STOCK_PRICE_FIELDS);
        return value.split(",").every(field => availableFields.delete(field));
      },
      errorMessage: `fields invalid, options are ${STOCK_PRICE_FIELDS.slice(0, STOCK_PRICE_FIELDS.length - 1).join(", ")}, and ${STOCK_PRICE_FIELDS[STOCK_PRICE_FIELDS.length - 1]}`
    },
    customSanitizer: {
      options: (fields: string) => {
        return fields ? fields.split(",").filter(value => value !== "").map(field => fieldsMap[field] || field) : "*";
      }
    }
  },
  orderBy: {
    in: "query",
    optional: true,
    notEmpty: {
      errorMessage: "orderBy must not be empty"
    },
    trim: true,
    isIn: {
      options: [STOCK_PRICE_FIELDS, STOCK_PRICE_FIELDS],
      errorMessage: `orderBy invalid, options are ${STOCK_PRICE_FIELDS.slice(0, STOCK_PRICE_FIELDS.length - 1).join(", ")} or ${STOCK_PRICE_FIELDS[STOCK_PRICE_FIELDS.length - 1]}`
    }
  },
  page,
  pageSize,
  date: {
    in: "query",
    optional: true,
    notEmpty: {
      errorMessage: "date must not be empty"
    },
    trim: true,
    isISO8601: {
      errorMessage: "date must be a valid ISO8601 date"
    }
  },
  companyTickers
});

export default SearchSchema;
