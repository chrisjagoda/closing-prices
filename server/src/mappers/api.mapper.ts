const fieldMap = new Map([
  ["companyTicker", "company_ticker as companyTicker"],
  ["closingPrice", "closing_price as closingPrice"],
]);

export const mapCompanyTickers = (company_tickers: string) => {
  return company_tickers ? company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase()) : null;
};

export const mapFields = (fields: string) => {
  return fields ? fields.split(",").filter(value => value !== "").map(field => fieldMap.get(field) || field) : "*";
};
