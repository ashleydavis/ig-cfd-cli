
import { assert } from 'chai';
import * as request from 'request-promise';
import { IDataFrame, DataFrame } from 'data-forge';

import * as path from 'path';

/**
 * Represents a bar: a period of time in which trading occurred.
 */
export interface IBar {
    /**
     * The timestamp for the start of the bar.
     */
    timestamp: string;

    // Buy price.
    openBid: number;
    highBid: number;
    lowBid: number;
    closeBid: number;

    // Sell price.
    openAsk: number;
    highAsk: number;
    lowAsk: number;
    closeAsk: number;
}

export interface IConfig {
    baseUrl: string;
    userName: string;
    password: string;
    apiKey: string;
}

const config = require(path.join(process.cwd(), "config.json")) as IConfig;

const baseUrl = config.baseUrl;
const loginUrl = baseUrl + "/session";
const priceUrl = baseUrl + "/prices";

/**
 * JavaScript API for the IG HTTP API.
 */
export class IgApi {
    private headers: any = {
        "X-IG-API-KEY": config.apiKey,
    };

    private async post (url: string, body: any, version: number, fullResponse?: boolean): Promise<any> {
        const headers = Object.assign({}, this.headers);
        headers.VERSION = version;

        return await request.post({ 
            uri: url, 
            body: body, 
            json: true, 
            headers: headers, 
            resolveWithFullResponse: fullResponse,
        });
    }
    
    private async get (url: string, version: number): Promise<any> {
        const headers = Object.assign({}, this.headers);
        headers.VERSION = version;

        return await request.get({ 
            uri: url, 
            json: true, 
            headers: headers, 
        });
    }

    /**
     * Login to the IG API.
     */
    async login (): Promise<void> {
        const postBody = {
            identifier: config.userName,
            password: config.password,
        };
        
        const loginResponse = await this.post(loginUrl, postBody, 2, true);

        //console.log("Login response:");
        //console.log(loginResponse.body);

        this.headers["X-SECURITY-TOKEN"] = loginResponse.headers["x-security-token"];
        this.headers["CST"] = loginResponse.headers["cst"];
    }

    /**
     * Get the history for a particular symbol.
     *
     * Resolution options: 
     * 
     * MINUTE
     * MINUTE_2
     * MINUTE_3
     * MINUTE_5
     * MINUTE_10 
     * MINUTE_15
     * MINUTE_30
     * HOUR
     * HOUR_2
     * HOUR_3
     * HOUR_4
     * DAY
     * WEEK
     * MONTH
     * 
     * @param epic The CFD for which to get the price history.
     * @param numBars Number of bars of data to retreive.
     * @param resolution Time resolution for each bar.
     */
    async getPriceHistory (epic: string, numBars: number, resolution: string): Promise<IDataFrame<number, IBar>> {
        
        const epicPriceUrl = priceUrl + "/" + epic + "/" + resolution + "/" + numBars;
        console.log("<< " + epicPriceUrl);
        const response = await this.get(epicPriceUrl, 2);

        console.log("Got " + response.prices.length + " bars.");

        let df: IDataFrame = new DataFrame(response.prices);

        let numIssues = 0;

        // Filter out bad values.
        df = df.where((row: any) => {
                const hasBadValue = 
                    row.openPrice.bid === null || 
                    row.openPrice.ask === null ||
                    row.closePrice.bid === null ||
                    row.closePrice.ask === null ||
                    row.highPrice.bid === null ||
                    row.highPrice.ask === null ||
                    row.lowPrice.bid === null ||
                    row.lowPrice.ask === null;
                if (hasBadValue) {
                    ++numIssues;
                    return false; // Strip it out.
                }

                return true;
            })
            .bake();

        if (numIssues > 0) {
            console.log("Stripped bad data from " + epic + " price history, " + numIssues + " bad rows.");
        }

        df = df
            .renameSeries({
                snapshotTime: "timestamp",
            })
            .select((row: any): IBar => {
            return {
                timestamp: row.timestamp,

                openBid: row.openPrice.bid,
                highBid: row.highPrice.bid,
                lowBid: row.lowPrice.bid,
                closeBid: row.closePrice.bid,

                openAsk: row.openPrice.ask,
                highAsk: row.highPrice.ask,
                lowAsk: row.lowPrice.ask,
                closeAsk: row.closePrice.ask,
            };
        });

        return df.bake();
    }
}