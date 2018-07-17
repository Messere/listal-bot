import * as commandLineArgs from "command-line-args";
import { CommandLineOptions } from "command-line-args";
import * as commandLineUsage from "command-line-usage";
import { OptionDefinition } from "command-line-usage";
import IDownloaderArguments from "./IDownloaderArguments";

export default class ArgumentParser {

    private readonly optionDefinitions: OptionDefinition[] = [
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
            description: "image download timeout in seconds",
            name: "timeout",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 10 : parsedValue;
            },
            typeLabel: "<seconds>",
        },
        {
            alias: "c",
            defaultValue: 5,
            description: "number of concurrent image downloads",
            name: "concurrency",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 10 : parsedValue;
            },
            typeLabel: "<number>",
        },
        {
            alias: "r",
            defaultValue: 5,
            description: "maximum number of retries after image download error",
            name: "retries",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 5 : parsedValue;
            },
            typeLabel: "<number>",
        },
    ];

    public isValid(downloaderArgs: IDownloaderArguments): boolean {
        return typeof downloaderArgs.destinationDir === "string" &&
            downloaderArgs.destinationDir.length > 0 &&
            typeof downloaderArgs.url === "string" &&
            downloaderArgs.url.length > 0;
    }

    public getArguments(inputArgs: string[]): IDownloaderArguments {
        const options: CommandLineOptions = commandLineArgs(
            this.optionDefinitions,
            {
                argv: inputArgs,
                partial: true,
            },
        );

        return {
            concurrentDownloadsNumber: options.concurrency,
            destinationDir: options.output,
            help: options.help,
            overwriteExisting: options.overwrite,
            retries: options.retries,
            timeoutSeconds: options.timeout,
            url: options.url,
        };
    }

    public getUsage(): string {
        const sections = [
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
    }
}
