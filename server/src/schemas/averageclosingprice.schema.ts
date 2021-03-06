import { checkSchema } from "express-validator";

import { companyTickers } from "../schemas/shared.schema";

const AverageClosingPriceSchema = checkSchema({
  start: {
    in: "query",
    optional: true,
    notEmpty: {
      errorMessage: "start must not be empty"
    },
    trim: true,
    isISO8601: {
      errorMessage: "start must be a valid ISO8601 date"
    }
  },
  end: {
    in: "query",
    optional: true,
    notEmpty: {
      errorMessage: "end must not be empty"
    },
    trim: true,
    isISO8601: {
      errorMessage: "end must be a valid ISO8601 date"
    }
  },
  companyTickers
});

export default AverageClosingPriceSchema;
