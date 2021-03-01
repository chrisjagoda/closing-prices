const csv = require("csv-parser");
const fs = require("fs");

// SQLite blows up for large inserts, so this is used to set the batch size for inserting in chunks
const BATCH_SIZE = 300;

exports.seed = async function(knex) {
  await knex("stock_price").del();

  await new Promise(resolve => {
    const data = [];

    fs.createReadStream("../closing_prices.csv")
    .pipe(csv())
    .on("data", ({closing_price, company_ticker, date}) => {

      data.push({
        closing_price: parseFloat(closing_price),
        company_ticker,
        date
      });
    })
    .on("end", async () => {
      const results = await knex.batchInsert("stock_price", data, BATCH_SIZE);
      resolve(results);
    });
  });
};
