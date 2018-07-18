"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var commandLineUsage = require("command-line-usage");
var ArgumentParser = /** @class */ (function () {
    function ArgumentParser() {
        this.optionDefinitions = [
            {
                alias: "u",
                description: "listal url to download (e.g. http://www.listal.com/<name>), or simply <name>",
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
                defaultValue: false,
                description: "append name extracted from url to output directory",
                name: "append-name",
                type: Boolean,
            },
            {
                alias: "h",
                defaultValue: false,
                description: "show this help",
                name: "help",
                type: Boolean,
            },
            {
                alias: "x",
                defaultValue: false,
                description: "overwrite existing files (by default only new files are downloaded)",
                name: "overwrite",
                type: Boolean,
            },
            {
                alias: "t",
                defaultValue: 10,
                description: "image download timeout in seconds (default: 10)",
                name: "timeout",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 10 : parsedValue;
                },
                typeLabel: "<seconds>",
            },
            {
                alias: "c",
                defaultValue: 15,
                description: "number of concurrent image downloads (default: 15)",
                name: "concurrency",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 15 : parsedValue;
                },
                typeLabel: "<number>",
            },
            {
                alias: "p",
                defaultValue: 5,
                description: "number of concurrent page downloads (default: 5)",
                name: "page-concurrency",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 5 : parsedValue;
                },
                typeLabel: "<number>",
            },
            {
                alias: "r",
                defaultValue: 5,
                description: "maximum number of retries after image download error (default: 5)",
                name: "retries",
                type: function (value) {
                    var parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 5 : parsedValue;
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
        var options = commandLineArgs(this.optionDefinitions, {
            argv: inputArgs,
            partial: true,
        });
        return {
            appendName: options["append-name"],
            concurrentImageDownloadsNumber: options.concurrency,
            concurrentPageDownloadsNumber: options["page-concurrency"],
            destinationDir: options.output,
            help: options.help,
            overwriteExisting: options.overwrite,
            retries: options.retries,
            timeoutSeconds: options.timeout,
            url: options.url,
        };
    };
    ArgumentParser.prototype.getUsage = function () {
        var sections = [
            {
                content: "Download all images from listal page.",
                header: "listal-bot",
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
    return ArgumentParser;
}());
exports.default = ArgumentParser;
