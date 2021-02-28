const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const connection = new sqlite3.Database(path.resolve(__dirname, "./db/stock_price.db"), sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, err => {
  if (err) {
    return console.error(`Error connecting to or creating stock price database: ${err.message}`);
  }

  console.log("Connected to stock price database.");
  
  createTable()
  .then(createPercentChangeDayView)
  .then(readAndInsertValues)
  .catch(console.error)
  .finally(() => {
    connection.close(err => {
      if (err) {
        return console.error(`Error disconnecting stock price database: ${err.message}`);
      }

      console.log("Disconnected from stock price database.");
    });
  });
});

function createTable() {
  return new Promise((resolve, reject) => {
    connection.run("CREATE TABLE IF NOT EXISTS closing_prices(company_ticker TEXT, date TEXT, closing_price REAL);", err => {
      if (err) {
        return reject(`Error creating closing prices table: ${err.message}`);
      }
    
      console.log("Created closing prices table.");
      resolve();
    });
  });
}

function createPercentChangeDayView() {
  return new Promise((resolve, reject) => {
    connection.run(`
      CREATE VIEW IF NOT EXISTS percent_change_day AS
        SELECT
          date start_date,
          LEAD (date, 1) OVER w end_date,
          company_ticker,
          closing_price start_closing_price,
          LEAD (closing_price, 1) OVER w end_closing_price,
          (LEAD (closing_price, 1) OVER w - closing_price) / closing_price percent_change_day
        FROM
          closing_prices
        WINDOW w AS (
          PARTITION BY company_ticker
          ORDER BY date
        )
        ORDER BY date, company_ticker ASC;
    `, err => {
      if (err) {
        return reject(`Error creating percent change day view: ${err.message}`);
      }

      return resolve();
    });
  })
}

function insertValue({ company_ticker, date, closing_price }) {
  console.log(`Inserting row ${company_ticker}, ${date}, ${closing_price}`);
  return new Promise((resolve, reject) => {
    connection.run(`
      INSERT INTO closing_prices(company_ticker, date, closing_price)
      VALUES ('${company_ticker}', '${date}', ${closing_price});
    `, err => {
      if (err) {
        return reject(`Error inserting value: ${err.message}`);
      }

      return resolve();
    });
  });
}

function readAndInsertValues() {
  const promises = [];
  return new Promise((resolve, reject) => {
    console.log("Reading closing prices from csv and inserting into connection.");
    
    connection.parallelize(() => {
      fs.createReadStream("../closing_prices.csv")
        .pipe(csv())
        .on("error", err => reject(`Error reading closing prices from csv: ${err.message}`))
        .on("data", value => promises.push(insertValue(value)))
        .on("end", () => {
          Promise.all(promises)
            .then(() => {
              console.log("Finished inserting closing prices.");
              resolve();
            }).catch(reject);
          });
        });
    });
}
