# ig-cfds-data-downloader

Downloads price history for a CFD from the IG API.

To learn more about working with data in JavaScript please read my book [Data Wrangling with JavaScript](http://bit.ly/2t2cJu2).

For news and updates see my blog [The Data Wrangler](http://www.the-data-wrangler.com/).

## CLI usage

You must have Node.js installed to use this tool.

Install it globally:

    npm install -g ig-cfds-data-downloader

Run it, specify the epic (name) of the CFD and your login details:

    ig-cfds-data-downloader --epic=todo --user=<your-user-name> --pw=<your-password>

This will download a CSV file with price history for the requested CFD to the current directory.

## WARNING

!! Please be aware that if you run this multiple times you can quickly exhaust your data limits with IG.


## TODO

- Read config.json from current working directory to provide epic, user name and password.