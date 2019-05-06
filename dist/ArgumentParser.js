"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var commandLineUsage = require("command-line-usage");
var DownloaderArgumentsDefaults_1 = require("./DownloaderArgumentsDefaults");
var Version_1 = require("./Version");
var ArgumentParser = /** @class */ (function () {
    function ArgumentParser() {
        this.optionDefinitions = [
            {
                alias: "u",
                description: "Listal URL to download (e.g. http://www.listal.com/<name>), or simply <name>",
                name: "url",
                typeLabel: "<url|name>",
            },
            {
                alias: "o",
                description: "output directory (will be created if does not exist)",
                name: "output",
                typeLabel: "<dir>",
            },
            {
                alias: "a",
                defaultValue: DownloaderArgumentsDefaults_1.default.appendName,
                description: "append name extracted from URL to output directory",
                name: "append-name",
                type: Boolean,
            },
            {
                alias: "k",
                defaultValue: DownloaderArgumentsDefaults_1.default.appendCategory,
                description: "append category extracted from URL to output directory",
                name: "append-category",
                type: Boolean,
            },
            {
                alias: "b",
                defaultValue: DownloaderArgumentsDefaults_1.default.appendCategory && DownloaderArgumentsDefaults_1.default.appendName,
                description: "append category and name extracted from URL to output directory",
                name: "append-category-name",
                type: Boolean,
            },
            {
                alias: "l",
                defaultValue: DownloaderArgumentsDefaults_1.default.minPageNumber + ":" + (DownloaderArgumentsDefaults_1.default.maxPageNumber ? DownloaderArgumentsDefaults_1.default.maxPageNumber : ""),
                description: "download only from a single page (-l 5), a range of pages (-l 3:6), from page to" +
                    " the end (-l 7:) or from the start to a page (-l :12)",
                name: "limit-to",
            },
            {
                alias: "x",
                defaultValue: DownloaderArgumentsDefaults_1.default.overwriteExisting,
                description: "overwrite existing files (by default only new files are downloaded)",
                name: "overwrite",
                type: Boolean,
            },
            {
                alias: "h",
                defaultValue: DownloaderArgumentsDefaults_1.default.showHelp,
                description: "show this help",
                name: "help",
                type: Boolean,
            },
            {
                alias: "v",
                defaultValue: DownloaderArgumentsDefaults_1.default.showVersion,
                description: "show program version",
                name: "version",
                type: Boolean,
            },
            {
                alias: "t",
                defaultValue: DownloaderArgumentsDefaults_1.default.timeoutSeconds,
                description: "image download timeout in seconds (default: " + DownloaderArgumentsDefaults_1.default.timeoutSeconds + ")",
                name: "timeout",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? DownloaderArgumentsDefaults_1.default.timeoutSeconds : parsedValue;
                },
                typeLabel: "<seconds>",
            },
            {
                alias: "c",
                defaultValue: DownloaderArgumentsDefaults_1.default.concurrentImageDownloadsNumber,
                description: "number of concurrent image downloads (default: " + DownloaderArgumentsDefaults_1.default.concurrentImageDownloadsNumber + ")",
                name: "concurrency",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? DownloaderArgumentsDefaults_1.default.concurrentImageDownloadsNumber : parsedValue;
                },
                typeLabel: "<number>",
            },
            {
                alias: "p",
                defaultValue: DownloaderArgumentsDefaults_1.default.concurrentPageDownloadsNumber,
                description: "number of concurrent page downloads (default: " + DownloaderArgumentsDefaults_1.default.concurrentPageDownloadsNumber + ")",
                name: "page-concurrency",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? DownloaderArgumentsDefaults_1.default.concurrentPageDownloadsNumber : parsedValue;
                },
                typeLabel: "<number>",
            },
            {
                alias: "r",
                defaultValue: DownloaderArgumentsDefaults_1.default.retries,
                description: "maximum number of retries after image download error (default: " + DownloaderArgumentsDefaults_1.default.retries + ")",
                name: "retries",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? DownloaderArgumentsDefaults_1.default.retries : parsedValue;
                },
                typeLabel: "<number>",
            },
        ];
    }
    ArgumentParser.prototype.isValid = function (downloaderArgs) {
        return typeof downloaderArgs.destinationDir === "string" &&
            downloaderArgs.destinationDir.length > 0 &&
            typeof downloaderArgs.url === "string" &&
            downloaderArgs.url.length > 0;
    };
    ArgumentParser.prototype.getArguments = function (inputArgs) {
        var _a;
        var options = commandLineArgs(this.optionDefinitions, {
            argv: inputArgs,
            partial: true,
        });
        var downloaderArguments = {
            appendCategory: options["append-category"] || options["append-category-name"],
            appendName: options["append-name"] || options["append-category-name"],
            concurrentImageDownloadsNumber: options.concurrency,
            concurrentPageDownloadsNumber: options["page-concurrency"],
            destinationDir: options.output,
            overwriteExisting: options.overwrite,
            retries: options.retries,
            showHelp: options.help,
            showVersion: options.version,
            timeoutSeconds: options.timeout,
            url: options.url,
        };
        _a = this.parsePageRange(options["limit-to"]), downloaderArguments.minPageNumber = _a[0], downloaderArguments.maxPageNumber = _a[1];
        return downloaderArguments;
    };
    ArgumentParser.prototype.getUsage = function () {
        var sections = [
            {
                content: "Download all images from listal page.",
                header: "listal-bot " + Version_1.default,
            },
            {
                content: "Usage listal-bot -u <url> -o <dir> [options]\n\nOptions -u and -o are required.",
                header: "Usage",
            },
            {
                header: "Options",
                optionList: this.optionDefinitions,
            },
        ];
        return commandLineUsage(sections);
    };
    ArgumentParser.prototype.parsePageRange = function (pageRange) {
        var rangeParts = pageRange.split(":").map(function (element, idx) {
            if (idx > 1) {
                throw new Error("Invalid page range in -l/--limit-to option (too many colons)");
            }
            var intPart = parseInt(element, 10);
            if (element !== "" && isNaN(intPart)) {
                throw new Error("Invalid page range in -l/--limit-to option (element \"" + element + "\" is not a number)");
            }
            return element === "" ? null : intPart;
        });
        if (rangeParts.length === 0) {
            return [1, null];
        }
        if (rangeParts[0] === null) {
            rangeParts[0] = 1;
        }
        if (rangeParts.length === 1) {
            return [rangeParts[0], rangeParts[0]];
        }
        return rangeParts;
    };
    return ArgumentParser;
}());
exports.default = ArgumentParser;
