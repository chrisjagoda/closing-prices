import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists("closing_prices", table => {
    table.increments();
    table.string("company_ticker");
    table.date("date");
    table.double("closing_price");
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
      closing_prices
    WINDOW w AS (
      PARTITION BY company_ticker
      ORDER BY date
    )
    ORDER BY date, company_ticker ASC;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('closing_prices');

  await knex.schema.raw(`DROP VIEW IF EXISTS percent_change_day`);
}

export async function seed(knex: Knex): Promise<void> {
  await knex("closing_prices").del();

  await knex("closing_prices").insert
}