import { query } from "express-validator";

const fields = [
  "closingPrice",
  "companyTicker",
  "date",
];

export const search = [
  query("fields")
    .optional()
    .notEmpty()
    .withMessage("fields must not be empty")
    .trim()
    .custom((value: string) => {
      const availableFields = new Set(fields);
      return value.split(",").every(field => availableFields.delete(field));
    })
    .withMessage("fields invalid, options are closingPrice, companyTicker, and date"),
  query("by")
    .optional()
    .notEmpty()
    .withMessage("by must not be empty")
    .trim()
    .isIn(fields)
    .withMessage("by invalid, options are closingPrice, companyTicker, or date"),
  query("sort")
    .optional()
    .notEmpty()
    .withMessage("sort must not be empty")
    .trim()
    .matches(/(asc)|(desc)/i)
    .withMessage("sort invalid, available options are asc or desc"),
  query("companyTickers")
    .optional()
    .notEmpty()
    .withMessage("companyTickers must not be empty")
    .trim()
    .matches(/^[-a-zA-Z,]*$/)
    .withMessage("companyTickers must contain only letters and dashes and be separated by commas"),
  query("date")
    .optional()
    .notEmpty()
    .withMessage("date must not be empty")
    .trim()
    .isISO8601()
    .withMessage("date must be a valid ISO8601 date"),
  query("limit")
    .optional()
    .notEmpty()
    .withMessage("limit must not be empty")
    .trim()
    .isInt({ min: 1, max: 100000 })
    .withMessage("limit must be integer between 1 and 100000")
    .toInt(),
];

export const averageClosingPrice = [
  query("companyTickers")
    .optional()
    .notEmpty()
    .withMessage("companyTickers must not be empty")
    .trim()
    .matches(/^[-a-zA-Z,]*$/)
    .withMessage("companyTickers must contain only letters and dashes and be separated by commas"),
  query("start")
    .notEmpty()
    .withMessage("start must not be empty")
    .trim()
    .isISO8601()
    .withMessage("start must be a valid ISO8601 date"),
  query("end")
    .notEmpty()
    .withMessage("end must not be empty")
    .trim()
    .isISO8601()
    .withMessage("end must be a valid ISO8601 date"),
];

export const percentChangeDay = [
  query("limit")
    .optional()
    .notEmpty()
    .withMessage("limit must not be empty")
    .trim()
    .isInt({ min: 1, max: 1000 })
    .withMessage("limit must be integer between 1 and 1000")
    .toInt(),
  query("sort")
    .optional()
    .notEmpty()
    .withMessage("sort must not be empty")
    .trim()
    .matches(/(asc)|(desc)/i)
    .withMessage("sort invalid, available options are asc or desc"),
  query("companyTickers")
    .optional()
    .notEmpty()
    .trim()
    .matches(/^[-a-zA-Z,]*$/)
    .withMessage("companyTickers must contain only letters and dashes and be separated by commas"),
];
