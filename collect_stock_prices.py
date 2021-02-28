"""Script to get historical closing prices for a given stocks list. 

https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?serietype=line

On every run it will delete existing file and create a new one. 
"""
import os
import logging
import sys

import requests
import csv


TEMPLATE_URL = 'https://financialmodelingprep.com/api/v3/historical-price-full/{ticker}?serietype=line'
PRICES_FILENAME = 'closing_prices.csv'


_log = logging.getLogger()
_log.setLevel(logging.INFO)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
_log.addHandler(handler)


def get_prices_for_given_ticker(ticker, write_header=False):
	url = TEMPLATE_URL.format(ticker=ticker)
	r = requests.get(url)
	data = r.json()

	with open(PRICES_FILENAME, mode='a+') as csv_file:
		fieldnames = ['company_ticker', 'date', 'closing_price']
    	
		writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
		if write_header:
			writer.writeheader()

		for record in data['historical']:
			writer.writerow({'company_ticker': ticker, 'date': record['date'], 'closing_price': record['close']})


if __name__ == '__main__':
	if os.path.exists(PRICES_FILENAME):
		os.remove(PRICES_FILENAME)
	
	tickers = ['AAPL', 'AMZN', 'GOOG', 'FB', 'NFLX']
	write_header = True
	for ticker in tickers:
		_log.info('Getting prices for: {}'.format(ticker))
		get_prices_for_given_ticker(ticker, write_header)
		write_header = False
		_log.info('Prices for: {} written to file: {}'.format(ticker, PRICES_FILENAME))
	
	_log.info('Done!')
