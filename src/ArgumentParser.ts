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
            alias: "a",
            defaultValue: false,
            description: "append name extracted from url to output directory",
            name: "append-name",
            type: Boolean,
        },
        {
            alias: "l",
            defaultValue: "1:",
            description: "download only from single page (-l 5), " +
                "range of pages (-l 3:6), from page to the end (-l 7:) or from the start to page (-l :12)",
            name: "limit-to",
        },
        {
            alias: "x",
            defaultValue: false,
            description: "overwrite existing files (by default only new files are downloaded)",
            name: "overwrite",
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
            alias: "t",
            defaultValue: 10,
            description: "image download timeout in seconds (default: 10)",
            name: "timeout",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 10 : parsedValue;
            },
            typeLabel: "<seconds>",
        },
        {
            alias: "c",
            defaultValue: 15,
            description: "number of concurrent image downloads (default: 15)",
            name: "concurrency",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 15 : parsedValue;
            },
            typeLabel: "<number>",
        },
        {
            alias: "p",
            defaultValue: 5,
            description: "number of concurrent page downloads (default: 5)",
            name: "page-concurrency",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 5 : parsedValue;
            },
            typeLabel: "<number>",
        },
        {
            alias: "r",
            defaultValue: 5,
            description: "maximum number of retries after image download error (default: 5)",
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

        const downloaderArguments = {
            appendName: options["append-name"],
            concurrentImageDownloadsNumber: options.concurrency,
            concurrentPageDownloadsNumber: options["page-concurrency"],
            destinationDir: options.output,
            help: options.help,
            overwriteExisting: options.overwrite,
            retries: options.retries,
            timeoutSeconds: options.timeout,
            url: options.url,
        } as IDownloaderArguments;

        [downloaderArguments.minPageNumber, downloaderArguments.maxPageNumber] =
            this.parsePageRange(options["limit-to"]);

        return downloaderArguments;
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

    private parsePageRange(pageRange: string): number[] {
        const rangeParts = pageRange.split(":").map((element, idx) => {
            if (idx > 1) {
                throw new Error("Invalid page range in -l/--limit-to option (too many colons)");
            }
            const intPart = parseInt(element, 10);
            if (element !== "" && isNaN(intPart)) {
                throw new Error(`Invalid page range in -l/--limit-to option (element "${element}" is not a number)`);
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
    }
}
