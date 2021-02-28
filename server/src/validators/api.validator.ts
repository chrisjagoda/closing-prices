import { query } from "express-validator";

export const search = [
  query("fields")
    .optional()
    .not().isEmpty()
    .trim()
    .custom((value: string) => {
      const availableFields = new Set([
        "company_ticker",
        "date",
        "closing_price"
      ]);
      return value.split(",").every(field => availableFields.delete(field));
    }),
  query("by")
    .optional()
    .not().isEmpty()
    .trim()
    .matches(/(company_ticker)|(date)|(closing_price)/),
  query("sort")
    .optional()
    .not().isEmpty()
    .trim()
    .matches(/(asc)|(desc)/i),
  query("company_ticker")
    .optional()
    .not().isEmpty()
    .trim()
    .matches(/(GOOG)|(AAPL)|(AMZN)|(FB)|(NFLX)/),
  query("date")
    .optional()
    .not().isEmpty()
    .trim()
    .isISO8601()
    .matches(/\d{4}-\d{2}-\d{2}/),
  query("limit")
    .optional()
    .not().isEmpty()
    .trim()
    .isInt({ min: 1, max: 100000 })
    .toInt()
];

export const averageClosingPrice = [
  query("company_ticker")
    .not().isEmpty()
    .trim()
    .matches(/(GOOG)|(AAPL)|(AMZN)|(FB)|(NFLX)/),
  query("start")
    .not().isEmpty()
    .trim()
    .isISO8601()
    .matches(/\d{4}-\d{2}-\d{2}/),
  query("end")
    .not().isEmpty()
    .trim()
    .isISO8601()
    .matches(/\d{4}-\d{2}-\d{2}/)
];

export const percentChangeDay = [
  query("limit")
    .optional()
    .not().isEmpty()
    .trim()
    .isInt({ min: 1, max: 1000 })
    .toInt(),
  query("sort")
    .optional()
    .not().isEmpty()
    .trim()
    .matches(/(asc)|(desc)/i)
];
