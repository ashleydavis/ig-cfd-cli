
import * as moment from 'moment';
import { IgApi, IBar } from './ig-api';
import { IDataFrame } from 'data-forge';

export class IGDataDownloader {

    async run(epic: string, maxBars: number, resolution: string): Promise<void> {
        const ig = new IgApi();
        await ig.login();

        const data = await ig.getPriceHistory(epic, maxBars, resolution);
        
        const outputFileName = epic.replace(".", "-") + "-" + resolution + ".csv";
        await data.asCSV().writeFile(outputFileName);

        console.log(">> " + outputFileName);
    }
}
