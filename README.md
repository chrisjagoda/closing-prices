## Summary

This is a simple API written in Typescript for performing some basic retrievals and calculations on some stock closing price data.

## Requirements

These downloads are required to run the project:
- Node.js (https://nodejs.org/en/download/) v11+
- SQLite (https://www.sqlite.org/download.html) v3+

Once these have been downloaded and installed run `npm install` to install the necessary npm packages to run and test the project.
Unit tests and coverage checks can be run with `npm run test`.

## Usage

Once the requirements steps above have been complete, you must run the database migration scripts with `npm run migrate:up` and `npm run seed:run` to seed the database with the data from the closing_prices.csv file.
After completion, the project can be run and built in one step with `npm run start`.
The app can also be built and run in debug mode with hot-reloading using nodemon with `npm run debug`.
To see a full list of commands check in the package.json file under "scripts". 

## Answers

For each answer, copy/paste the execution of a simple `curl` command against your HTTP service and with its output and time execution.

---

#### Example

For example, the answer to Question #1 might look like so:

```bash
time curl http://localhost:5000/first_last_days
{
  "first_date": "YYYY-MM-DD",
  "last_date": "YYYY-MM-DD"
}
curl http://localhost:5000/first_last_days  0.01s user 0.01s system 14% cpu 0.120 total
```

---

1. What are the first and last dates represented in the relevant data?

```bash
time curl "http://localhost:3000/api/v1/search?orderBy=date&fields=date&sort=asc&page=1&pageSize=1" "http://localhost:3000/api/v1/search?orderBy=date&fields=date&sort=desc&page=1&pageSize=1"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    76  100    76    0     0     76      0  0:00:01 --:--:--  0:00:01  2451{"pagination":{"page":1,"pageSize":1},"stockPrices":[{"date":"1989-09-19"}]}
100    76  100    76    0     0     76      0  0:00:01 --:--:--  0:00:01    76{"pagination":{"page":1,"pageSize":1},"stockPrices":[{"date":"2019-11-15"}]}

real    0m0.066s
user    0m0.000s
sys     0m0.015s
```

2. What was the closing price of Facebook on January 1st, 2018?

```bash
time curl "http://localhost:3000/api/v1/search?companyTickers=FB&date=2018-01-01&fields=closingPrice"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    18  100    18    0     0     18      0  0:00:01 --:--:--  0:00:01   382{"stockPrices":[]}

real    0m0.066s
user    0m0.000s
sys     0m0.015s
```

3. What was the average closing price of Amazon in the month of July 2015?

```bash
time curl "http://localhost:3000/api/v1/averageClosingPrice?companyTickers=AMZN&start=2015-07-01&end=2015-07-31"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    42  100    42    0     0     42      0  0:00:01 --:--:--  0:00:01  2800[{"averageClosingPrice":478.709090909091}]

real    0m0.050s
user    0m0.000s
sys     0m0.015s
```

4. Assuming the fund holds an equal number of shares of each company, what were the top 10 biggest gaining days? The output should include the day and the % change from the previous day's close.

```bash
time curl "http://localhost:3000/api/v1/percentChangeDay?sort=desc&page=1&pageSize=10"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1788  100  1788    0     0   1788      0  0:00:01 --:--:--  0:00:01 11461{"pagination":{"page":1,"pageSize":10},"percentChangeDays":[{"startDate":"2001-11-23","endDate":"2001-11-26","startClosingPrice":10.5,"endClosingPrice":13.74,"companyTickers":"AAPL,AMZN","percentChangeDay":0.3085714285714286},{"startDate":"2001-04-06","endDate":"2001-04-09","startClosingPrice":9.84,"endClosingPrice":12.65,"companyTickers":"AAPL,AMZN","percentChangeDay":0.285569105691057},{"startDate":"2001-11-13","endDate":"2001-11-14","startClosingPrice":8.67,"endClosingPrice":10.89,"companyTickers":"AAPL,AMZN","percentChangeDay":0.2560553633217994},{"startDate":"2001-01-02","endDate":"2001-01-03","startClosingPrice":14.940000000000001,"endClosingPrice":18.729999999999997,"companyTickers":"AAPL,AMZN","percentChangeDay":0.25368139223560876},{"startDate":"1996-07-17","endDate":"1996-07-18","startClosingPrice":0.6,"endClosingPrice":0.75,"companyTickers":"AAPL","percentChangeDay":0.25000000000000006},{"startDate":"2001-03-02","endDate":"2001-03-05","startClosingPrice":11.379999999999999,"endClosingPrice":14.09,"companyTickers":"AAPL,AMZN","percentChangeDay":0.23813708260105457},{"startDate":"1999-09-28","endDate":"1999-09-29","startClosingPrice":68.00999999999999,"endClosingPrice":82.86,"companyTickers":"AAPL,AMZN","percentChangeDay":0.21835024261138083},{"startDate":"2002-01-18","endDate":"2002-01-22","startClosingPrice":11.74,"endClosingPrice":14.16,"companyTickers":"AAPL,AMZN","percentChangeDay":0.2061328790459966},{"startDate":"2000-02-02","endDate":"2000-02-03","startClosingPrice":72.97,"endClosingPrice":87.88,"companyTickers":"AAPL,AMZN","percentChangeDay":0.20433054680005477},{"startDate":"1998-11-20","endDate":"1998-11-23","startClosingPrice":31.360000000000003,"endClosingPrice":37.62,"companyTickers":"AAPL,AMZN","percentChangeDay":0.1996173469387753}]}

real    0m0.198s
user    0m0.000s
sys     0m0.015s
```
