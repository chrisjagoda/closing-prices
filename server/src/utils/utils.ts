export const parseCompanyTickers = (company_tickers: string) => {
  return company_tickers ? company_tickers.split(",").filter(value => value !== "").map(value => value.toUpperCase()) : [];
}
