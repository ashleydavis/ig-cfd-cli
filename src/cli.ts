
import { IGDataDownloader } from './index';

const command = process.argv[2];
if (!command) {
    console.log("Expected 1st parameter to be <command>.");
    process.exit(1);
}

if (command !== "price-history") {
    console.log("Currently the only command is 'price-history' to download the price history for a CFD.");
    process.exit(1);
}

const epic = process.argv[3];
if (!epic) {
    console.log("Expected 2nd parameter to be <epic> (the name of the CFD).");
    process.exit(1);
}

const maxBarsString = process.argv[4];
if (!maxBarsString) {
    console.log("Expected 3rd parameter to be <max-bars> (maximum bars to download).");
    process.exit(1);
}

const maxBars = parseInt(maxBarsString);
const resolution = process.argv[5] || "DAY";

const downloader = new IGDataDownloader();
downloader.run(epic, maxBars, resolution)
    .then(() => console.log("Done"))
    .catch(err => {
        console.error("Failed with error:");
        console.error(err && err.stack || err);
    });