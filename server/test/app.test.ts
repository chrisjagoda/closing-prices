import request from "supertest";

import App from "../src/app";
import connection from "../src/database/database";
import { initial_001 } from "../migrations";

let server: App;

beforeAll(async () => {
  server = new App();

  await initial_001.up(connection);

  await connection("stock_price").insert([
    {company_ticker: "AAPL", date: "1999-01-04", closing_price: 15.25},
    {company_ticker: "AAPL", date: "1999-01-05", closing_price: 16.25},
    {company_ticker: "AAPL", date: "1999-01-06", closing_price: 16.50},
    {company_ticker: "AAPL", date: "1999-01-07", closing_price: 16.75},
    {company_ticker: "AAPL", date: "1999-01-08", closing_price: 16},
    {company_ticker: "AMZN", date: "1999-01-04", closing_price: 5.25},
    {company_ticker: "AMZN", date: "1999-01-05", closing_price: 6.25},
    {company_ticker: "AMZN", date: "1999-01-06", closing_price: 7.25},
    {company_ticker: "AMZN", date: "1999-01-07", closing_price: 8.25},
    {company_ticker: "AMZN", date: "1999-01-08", closing_price: 6.75},
    {company_ticker: "GOOG", date: "1999-01-04", closing_price: 3.25},
    {company_ticker: "GOOG", date: "1999-01-05", closing_price: 4.25},
    {company_ticker: "GOOG", date: "1999-01-06", closing_price: 2.25},
    {company_ticker: "GOOG", date: "1999-01-07", closing_price: 4.75},
    {company_ticker: "GOOG", date: "1999-01-08", closing_price: 5},
    {company_ticker: "FB", date: "1999-01-04", closing_price: 2.25},
    {company_ticker: "FB", date: "1999-01-05", closing_price: 1.25},
    {company_ticker: "FB", date: "1999-01-06", closing_price: 5.25},
    {company_ticker: "FB", date: "1999-01-07", closing_price: 3.25},
    {company_ticker: "FB", date: "1999-01-08", closing_price: 1.5},
    {company_ticker: "NFLX", date: "1999-01-04", closing_price: 1.25},
    {company_ticker: "NFLX", date: "1999-01-05", closing_price: 3.25},
    {company_ticker: "NFLX", date: "1999-01-06", closing_price: 5.25},
    {company_ticker: "NFLX", date: "1999-01-07", closing_price: 3.25},
    {company_ticker: "NFLX", date: "1999-01-08", closing_price: 4.25}
  ]);
});

describe("GET /random-url", () => {
  test("should return 404", (done) => {
    request(server.app).get("/random-url")
      .expect(404, done);
  });
});

describe("GET /api/v1/search", () => {
  test("should return 200 status and all results", (done) => {
    request(server.app).get("/api/v1/search")
      .expect(200)
      .then(({ body }) => {
        const results = body.stockPrices;
        expect(results.length).toEqual(25);
        done();
      });
  });

  test("should return first date represented in results", (done) => {
    request(server.app).get("/api/v1/search?by=date&fields=date&sort=asc&limit=1")
      .expect(200)
      .then(({ body }) => {
        const results = body.stockPrices;
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ date: "1999-01-04"});
        done();
      });
  });

  test("should return last date represented in results", (done) => {
    request(server.app).get("/api/v1/search?by=date&fields=date&sort=desc&limit=1")
      .expect(200)
      .then(({ body }) => {
        const results = body.stockPrices;
        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ date: "1999-01-08"});
        done();
      });
  });
});
