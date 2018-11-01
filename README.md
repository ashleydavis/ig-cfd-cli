# ig-cfd-cli

CLI tool and API for the IG CFDs API.

WORK IN PROGRESS:

- Currently allows price history of a CFD to be downloaded.

To learn more about working with data in JavaScript please read my book [Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

For news and updates see my blog [The Data Wrangler](http://www.the-data-wrangler.com/).

## WARNING

Please be aware that if you run this multiple times you can quickly exhaust your data limits with IG.

Use sparingly!

## CLI usage

You must have Node.js installed to use this tool.

Install it globally:

    npm install -g ig-cfd-cli

Create config.json in your working directory and fill out your IG account details:

    {
        "baseUrl": "https://demo-api.ig.com/gateway/deal",
        "userName": "<your-ig-username>",
        "password": "<your-ig-password>",
        "apiKey": "<your-ig-apikey>"
    }

You can start your config.json with a copy of the [template config.json](https://github.com/ashleydavis/ig-cfd-cli/blob/master/example-config.json):

Now run the command line tool to download the price history for a CFD:

    ig-cfd-cli price-history <epic> <max-bars> [<resolution>]

Options:

- epic - The name of the CFD to download price history.
- max-bars - Max number of bars to download (keep it as small as possible to avoid exhausting your data allowance).
- resolution - Optional resolution of bars, defaults to DAY.

For example to download the price history for the Bitcoin CFD:

    ig-cfd-cli price-history CS.D.BITCOIN.CFD.IP 10

This downloads the price history for the requested CFD to a CSV file in the working directory. 
It will be named after the epic that was requested. 

For example downloading CS.D.BITCOIN.CFD.IP will create the file CS-D-BITCOIN-CFD-IP.csv.

Resolution defaults to DAY, but you can set it to other values such as HOUR:

    ig-cfd-cli price-history CS.D.BITCOIN.CFD.IP 10 HOUR

The resolution parameter is passed directly to the IG API, available options are: 

    MINUTE
    MINUTE_2
    MINUTE_3
    MINUTE_5
    MINUTE_10
    MINUTE_15
    MINUTE_30
    HOUR
    HOUR_2
    HOUR_3
    HOUR_4
    DAY
    WEEK
    MONTH


## Missing features

- Document API usage.
- Get accounts, get positions, open position, close position, etc.

