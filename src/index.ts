#! /usr/bin/env node

import * as downloader from "image-downloader";
import fetch from "node-fetch";
import * as queue from "queue";
import ArgumentParser from "./ArgumentParser";
import ConsoleLogger from "./ConsoleLogger";
import Main from "./Main";

const logger = new ConsoleLogger();
const argParser = new ArgumentParser();

try {
    const args = argParser.getArguments(process.argv);

    if (args.help) {

        logger.log(argParser.getUsage());

    } else if (!argParser.isValid(args)) {

        logger.error("Fatal error: Missing url or destination dir.");
        logger.log(argParser.getUsage());

    } else {

        const main = new Main(logger, downloader, fetch, queue);

        main.run(
            args.url,
            args.destinationDir,
            args.overwriteExisting,
            args.concurrentDownloadsNumber,
            args.timeoutSeconds,
            args.retries,
        ).then(() => {
            logger.log("\nFinished");
        }).catch((e: Error) => {
            logger.error(`Fatal error: ${e.message}`);
        });
    }

} catch (e) {
    logger.error(`Fatal error: ${e.message}`);
}
