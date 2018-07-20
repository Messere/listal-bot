import { CommandLineOptions } from "command-line-args";
import * as commandLineArgs from "command-line-args";
import * as commandLineUsage from "command-line-usage";
import { OptionDefinition } from "command-line-usage";
import defaults from "./DownloaderArgumentsDefaults";
import IDownloaderArguments from "./IDownloaderArguments";
import version from "./Version";

export default class ArgumentParser {

    private readonly optionDefinitions: OptionDefinition[] = [
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
            defaultValue: defaults.appendName,
            description: "append name extracted from URL to output directory",
            name: "append-name",
            type: Boolean,
        },
        {
            alias: "k",
            defaultValue: defaults.appendCategory,
            description: "append category extracted from URL to output directory",
            name: "append-category",
            type: Boolean,
        },
        {
            alias: "b",
            defaultValue: defaults.appendCategory && defaults.appendName,
            description: "append category and name extracted from URL to output directory",
            name: "append-category-name",
            type: Boolean,
        },
        {
            alias: "l",
            defaultValue: `${defaults.minPageNumber}:${defaults.maxPageNumber ? defaults.maxPageNumber : ""}`,
            description: "download only from a single page (-l 5), a range of pages (-l 3:6), from page to" +
                " the end (-l 7:) or from the start to a page (-l :12)",
            name: "limit-to",
        },
        {
            alias: "x",
            defaultValue: defaults.overwriteExisting,
            description: "overwrite existing files (by default only new files are downloaded)",
            name: "overwrite",
            type: Boolean,
        },
        {
            alias: "h",
            defaultValue: defaults.showHelp,
            description: "show this help",
            name: "help",
            type: Boolean,
        },
        {
            alias: "v",
            defaultValue: defaults.showVersion,
            description: "show program version",
            name: "version",
            type: Boolean,
        },
        {
            alias: "t",
            defaultValue: defaults.timeoutSeconds,
            description: `image download timeout in seconds (default: ${defaults.timeoutSeconds})`,
            name: "timeout",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? defaults.timeoutSeconds : parsedValue;
            },
            typeLabel: "<seconds>",
        },
        {
            alias: "c",
            defaultValue: defaults.concurrentImageDownloadsNumber,
            description: `number of concurrent image downloads (default: ${defaults.concurrentImageDownloadsNumber})`,
            name: "concurrency",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? defaults.concurrentImageDownloadsNumber : parsedValue;
            },
            typeLabel: "<number>",
        },
        {
            alias: "p",
            defaultValue: defaults.concurrentPageDownloadsNumber,
            description: `number of concurrent page downloads (default: ${defaults.concurrentPageDownloadsNumber})`,
            name: "page-concurrency",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? defaults.concurrentPageDownloadsNumber : parsedValue;
            },
            typeLabel: "<number>",
        },
        {
            alias: "r",
            defaultValue: defaults.retries,
            description: `maximum number of retries after image download error (default: ${defaults.retries})`,
            name: "retries",
            type: (value) => {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? defaults.retries : parsedValue;
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
        } as IDownloaderArguments;

        [downloaderArguments.minPageNumber, downloaderArguments.maxPageNumber] =
            this.parsePageRange(options["limit-to"]);

        return downloaderArguments;
    }

    public getUsage(): string {
        const sections = [
            {
                content: "Download all images from listal page.",
                header: `listal-bot ${version}`,
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
