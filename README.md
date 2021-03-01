## Summary

This is a simple API written in Typescript for performing some basic retrievals and calculations on some stock closing price data.

## Requirements

These downloads are required to run the project:
- Node.js (https://nodejs.org/en/download/) v11+
- SQLite (https://www.sqlite.org/download.html) v3+

Once these have been downloaded and installed run `npm install` to install the necessary npm packages to run and test the project.
Unit tests and coverage checks can be run with `npm run test`.

## Usage

Once the requirements steps above have been complete, you must run the setup script with `npm run setup` to create the SQLite database and table and populate the table with the data from the closing_prices.csv file. This step may take a few minutes to complete.
After completion, the project can be run and built in one step with `npm run start`.
The app can also be built and run in debug mode with hot-reloading using nodemon with `npm run debug`.
To see a full list of commands check in the package.json file under "scripts". 

## Answers

For each answer, copy/paste the execution of a simple `curl` command against your HTTP service and with its output and time execution.

---

#### Example

For example, the answer to Question #1 might look like so:

```bash
⇒  time curl http://localhost:5000/first_last_days
{
  "first_date": "YYYY-MM-DD",
  "last_date": "YYYY-MM-DD"
}
curl http://localhost:5000/first_last_days  0.01s user 0.01s system 14% cpu 0.120 total
```

---

1. What are the first and last dates represented in the relevant data?

```bash
⇒  time curl "http://localhost:3000/api/v1/search?by=date&fields=date&sort=asc&limit=1" "http://localhost:3000/api/v1/search?by=date&fields=date&sort=desc&limit=1"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    23  100    23    0     0   1533      0 --:--:-- --:--:-- --:--:--  1533[{"date":"1989-09-19"}]
100    23  100    23    0     0  23000      0 --:--:-- --:--:-- --:--:-- 23000[{"date":"2019-11-15"}]

real    0m0.084s
user    0m0.000s
sys     0m0.031s
```

2. What was the closing price of Facebook on January 1st, 2018?

```bash
⇒  time curl "http://localhost:3000/api/v1/search?company_ticker=FB&date=2018-01-01&fields=closing_price"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100     2  100     2    0     0     64      0 --:--:-- --:--:-- --:--:--    64[]

real    0m0.061s
user    0m0.000s
sys     0m0.015s
```

3. What was the average closing price of Amazon in the month of July 2015?

```bash
⇒  time curl "http://localhost:3000/api/v1/averageClosingPrice?company_ticker=AMZN&start=2015-07-01&end=2015-07-31"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    40  100    40    0     0    851      0 --:--:-- --:--:-- --:--:--   851{"averageClosingPrice":478.709090909091}

real    0m0.112s
user    0m0.000s
sys     0m0.015s
```

4. Assuming the fund holds an equal number of shares of each company, what were the top 10 biggest gaining days? The output should include the day and the % change from the previous day's close.

```bash
⇒  time curl "http://localhost:3000/api/v1/percentChangeDay?limit=10&sort=desc"

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1728  100  1728    0     0  12342      0 --:--:-- --:--:-- --:--:-- 12342[{"startDate":"2001-11-23","endDate":"2001-11-26","startClosingPrice":10.5,"endClosingPrice":13.74,"companyTickers":"AAPL,AMZN","percentChangeDay":0.3085714285714286},{"startDate":"2001-04-06","endDate":"2001-04-09","startClosingPrice":9.84,"endClosingPrice":12.65,"companyTickers":"AAPL,AMZN","percentChangeDay":0.285569105691057},{"startDate":"2001-11-13","endDate":"2001-11-14","startClosingPrice":8.67,"endClosingPrice":10.89,"companyTickers":"AAPL,AMZN","percentChangeDay":0.2560553633217994},{"startDate":"2001-01-02","endDate":"2001-01-03","startClosingPrice":14.940000000000001,"endClosingPrice":18.729999999999997,"companyTickers":"AAPL,AMZN","percentChangeDay":0.25368139223560876},{"startDate":"1996-07-17","endDate":"1996-07-18","startClosingPrice":0.6,"endClosingPrice":0.75,"companyTickers":"AAPL","percentChangeDay":0.25000000000000006},{"startDate":"2001-03-02","endDate":"2001-03-05","startClosingPrice":11.379999999999999,"endClosingPrice":14.09,"companyTickers":"AAPL,AMZN","percentChangeDay":0.23813708260105457},{"startDate":"1999-09-28","endDate":"1999-09-29","startClosingPrice":68.00999999999999,"endClosingPrice":82.86,"companyTickers":"AAPL,AMZN","percentChangeDay":0.21835024261138083},{"startDate":"2002-01-18","endDate":"2002-01-22","startClosingPrice":11.74,"endClosingPrice":14.16,"companyTickers":"AAPL,AMZN","percentChangeDay":0.2061328790459966},{"startDate":"2000-02-02","endDate":"2000-02-03","startClosingPrice":72.97,"endClosingPrice":87.88,"companyTickers":"AAPL,AMZN","percentChangeDay":0.20433054680005477},{"startDate":"1998-11-20","endDate":"1998-11-23","startClosingPrice":31.360000000000003,"endClosingPrice":37.62,"companyTickers":"AAPL,AMZN","percentChangeDay":0.1996173469387753}]

real    0m0.392s
user    0m0.000s
sys     0m0.000s
```
