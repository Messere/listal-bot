#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var downloader = require("image-downloader");
var queue = require("queue");
var ArgumentParser_1 = require("./ArgumentParser");
var ConsoleLogger_1 = require("./ConsoleLogger");
var Fetch_1 = require("./Fetch");
var Main_1 = require("./Main");
var Version_1 = require("./Version");
var logger = new ConsoleLogger_1.default();
var argParser = new ArgumentParser_1.default();
try {
    var args = argParser.getArguments(process.argv);
    if (args.showHelp) {
        logger.log(argParser.getUsage());
    }
    else if (args.showVersion) {
        logger.log(Version_1.default);
    }
    else if (!argParser.isValid(args)) {
        logger.error("Fatal error: Missing url or destination dir.");
        logger.log(argParser.getUsage());
    }
    else {
        var main = new Main_1.default(logger, downloader, Fetch_1.default, queue);
        main.run(args).then(function () {
            logger.log("\nFinished");
        }).catch(function (e) {
            logger.error("\nFatal error: " + e.message);
        });
    }
}
catch (e) {
    logger.error("\nFatal error: " + e.message);
}
