import request from "supertest";

import App from "../src/app";
import ApiController from "../src/controllers/api.controller";
import { connect, connection } from "../src/database/database";

let server: App;
let apiController: ApiController;

beforeAll(async () => {
  await connect();

  apiController = new ApiController(connection);
  server = new App(apiController);

  await (() => new Promise<void>((resolve, reject) => {
    connection.run("CREATE TABLE closing_prices(company_ticker TEXT, date TEXT, closing_price REAL);", (err) => {
      if (err) {
        return reject(`Error creating closing prices table: ${err.message}`);
      }
    
      console.log("Created closing prices table.");
      resolve();
    });
  }))();
  await (() => new Promise<void>((resolve, reject) => {
    connection.run(`
      INSERT INTO closing_prices(company_ticker, date, closing_price)
      VALUES
      ('AAPL', '1999-01-04', '15.25'),
      ('AAPL', '1999-01-05', '16.25'),
      ('AAPL', '1999-01-06', '16.50'),
      ('AAPL', '1999-01-07', '16.75'),
      ('AAPL', '1999-01-08', '16'),
      ('AMZN', '1999-01-04', '5.25'),
      ('AMZN', '1999-01-05', '6.25'),
      ('AMZN', '1999-01-06', '7.25'),
      ('AMZN', '1999-01-07', '8.25'),
      ('AMZN', '1999-01-08', '6.75'),
      ('GOOG', '1999-01-04', '3.25'),
      ('GOOG', '1999-01-05', '4.25'),
      ('GOOG', '1999-01-06', '2.25'),
      ('GOOG', '1999-01-07', '4.75'),
      ('GOOG', '1999-01-08', '5'),
      ('FB', '1999-01-04', '2.25'),
      ('FB', '1999-01-05', '1.25'),
      ('FB', '1999-01-06', '5.25'),
      ('FB', '1999-01-07', '3.25'),
      ('FB', '1999-01-08', '1.5'),
      ('NFLX', '1999-01-04', '1.25'),
      ('NFLX', '1999-01-05', '3.25'),
      ('NFLX', '1999-01-06', '5.25'),
      ('NFLX', '1999-01-07', '3.25'),
      ('NFLX', '1999-01-08', '4.25');
    `, (err) => {
      if (err) {
        return reject(`Error inserting value: ${err.message}`);
      }

      console.log("Inserted values.");
      resolve();
    });
  }))();
});

describe("GET /random-url", () => {
  it("should return 404", (done) => {
    request(server.app).get("/reset")
      .expect(404, done);
  });
});

describe("GET /api/v1/search", () => {
  it("should return 200 status and all results", (done) => {
    request(server.app).get("/api/v1/search")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toEqual(25);
        done();
      });
  });
});

describe("GET /api/v1/search", () => {
  it("should return first date represented in results", (done) => {
    request(server.app).get("/api/v1/search?by=date&fields=date&sort=asc&limit=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0]).toEqual({ date: "1999-01-04"});
        done();
      });
  });
});

describe("GET /api/v1/search", () => {
  it("should return last date represented in results", (done) => {
    request(server.app).get("/api/v1/search?by=date&fields=date&sort=desc&limit=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0]).toEqual({ date: "1999-01-08"});
        done();
      });
  });
});
