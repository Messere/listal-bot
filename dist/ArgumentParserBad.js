"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var optimist_1 = require("optimist");
var ArgumentParserBad = /** @class */ (function () {
    function ArgumentParserBad() {
    }
    ArgumentParserBad.prototype.getArguments = function (inputArgs) {
        var optionsParser = optimist_1.default(inputArgs);
        var argv = optionsParser
            .usage("Download all images from listal page.\nUsage listal-bot -u <url> -o <dir> [options]")
            .demand(["u", "o"])
            .describe("u", "listal url to download (e.g. http://www.listal.com/<name>), or simply <name>")
            .alias("u", "url")
            .describe("o", "output directory (will be created if does not exist)")
            .alias("o", "output")
            .describe("x", "overwrite existing files (by default only new files are downloaded)")
            .alias("x", "overwrite")
            .boolean("x")
            .describe("t", "image download timeout in seconds")
            .alias("t", "timeout")
            .default("t", 10)
            .describe("c", "number of concurrent image downloads")
            .alias("c", "concurrency")
            .default("c", 5)
            .describe("r", "maximum number of retries after image download error")
            .alias("r", "retries")
            .default("r", 5)
            .argv;
        return {
            concurrentDownloadsNumber: this.getDefaultNumber(argv.c, 5),
            destinationDir: argv.o,
            overwriteExisting: argv.x,
            retries: argv.r,
            timeoutSeconds: this.getDefaultNumber(argv.t, 10),
            url: argv.u,
        };
    };
    ArgumentParserBad.prototype.getDefaultNumber = function (input, defaultValue) {
        var parsedNumber = parseInt(input, 10);
        if (isNaN(parsedNumber)) {
            parsedNumber = defaultValue;
        }
        return parsedNumber;
    };
    return ArgumentParserBad;
}());
exports.default = ArgumentParserBad;
