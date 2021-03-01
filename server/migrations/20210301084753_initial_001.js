
exports.up = async function(knex) {
  await knex.schema.createTableIfNotExists("stock_price", table => {
    table.increments();
    table.string("company_ticker");
    table.string("date");
    table.float("closing_price");
  });

  await knex.schema.raw(`
    CREATE VIEW IF NOT EXISTS percent_change_day AS
    SELECT
      date start_date,
      LEAD (date, 1) OVER w end_date,
      company_ticker,
      closing_price start_closing_price,
      LEAD (closing_price, 1) OVER w end_closing_price,
      (LEAD (closing_price, 1) OVER w - closing_price) / closing_price percent_change_day
    FROM
      stock_price
    WINDOW w AS (
      PARTITION BY company_ticker
      ORDER BY date
    )
    ORDER BY date, company_ticker ASC;
  `);
};

exports.down = async function(knex) {
  await knex.schema.dropTable('stock_price');

  await knex.schema.raw(`DROP VIEW IF EXISTS percent_change_day`);
};