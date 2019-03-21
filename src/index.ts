#! /usr/bin/env node

import * as downloader from "image-downloader";
import fetch from "node-fetch";
import * as puppeteer from 'puppeteer'
import * as queue from "queue";
import ArgumentParser from "./ArgumentParser";
import ConsoleLogger from "./ConsoleLogger";
import Main from "./Main";
import version from "./Version";

const logger = new ConsoleLogger();
const argParser = new ArgumentParser();

try {
    const args = argParser.getArguments(process.argv);

    if (args.showHelp) {

        logger.log(argParser.getUsage());

    } else if (args.showVersion) {

        logger.log(version);

    } else if (!argParser.isValid(args)) {

        logger.error("Fatal error: Missing url or destination dir.");
        logger.log(argParser.getUsage());

    } else {

        const main = new Main(logger, downloader, fetch, queue, puppeteer);

        main.run(args).then(() => {
            logger.log("\nFinished");
        }).catch((e: Error) => {
            logger.error(`\nFatal error: ${e.message}`);
        });

    }

} catch (e) {
    logger.error(`\nFatal error: ${e.message}`);
}
