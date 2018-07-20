import ArgumentParser from "../src/ArgumentParser";
import defaults from "../src/DownloaderArgumentsDefaults";
import IDownloaderArguments from "../src/IDownloaderArguments";

describe("Command line arguments", () => {
    let argumentParser;

    beforeEach(() => {
        argumentParser = new ArgumentParser();
    });

    it ("should parse short command line options", () => {
        const args = argumentParser.getArguments(
            ["-u", "abc", "-o", "xyz", "-h", "-x", "-t", "15", "-k", "-b",
             "-c", "20", "-p", "30", "-r", "100", "-a", "-l", "10:100", "-v"],
        );
        expect(args).toEqual({
            appendCategory: true,
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            maxPageNumber: 100,
            minPageNumber: 10,
            overwriteExisting: true,
            retries: 100,
            showHelp: true,
            showVersion: true,
            timeoutSeconds: 15,
            url: "abc",
        } as IDownloaderArguments);
    });

    it ("should parse long command line options", () => {
        const args = argumentParser.getArguments(
            ["--url", "abc", "--output", "xyz", "--help", "--overwrite", "--append-category",
            "--timeout", "15", "--concurrency", "20", "--page-concurrency", "30",
            "--retries", "100", "--append-name", "--limit-to", "10:100",
            "--append-category-name", "--version"],
        );
        expect(args).toEqual({
            appendCategory: true,
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            maxPageNumber: 100,
            minPageNumber: 10,
            overwriteExisting: true,
            retries: 100,
            showHelp: true,
            showVersion: true,
            timeoutSeconds: 15,
            url: "abc",
        } as IDownloaderArguments);
    });

    it ("should return only default values", () => {
        const args = argumentParser.getArguments([]);
        expect(args).toEqual(defaults);
    });

    it ("should say that arguments are invalid if url and directory is missing", () => {
        const args = argumentParser.getArguments([]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });

    it ("should say that arguments are invalid if url is missing", () => {
        const args = argumentParser.getArguments(["-o", "zyx"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });

    it ("should say that arguments are invalid if url is empty", () => {
        const args = argumentParser.getArguments(["-o", "zyx", "-u", ""]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });

    it ("should say that arguemnta are invalid if directory is missing", () => {
        const args = argumentParser.getArguments(["-u", "zyx"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });

    it ("should say that arguemnta are invalid if directory is empty", () => {
        const args = argumentParser.getArguments(["-o", "", "-u", "xyz"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });

    it ("should say that arguments are valid if url and dir are provided", () => {
        const args = argumentParser.getArguments(["-u", "abc", "-o", "zyx"]);
        expect(argumentParser.isValid(args)).toBeTruthy();
    });

    it ("should return usage string", () => {
        expect(argumentParser.getUsage()).toContain("Usage listal-bot -u <url> -o <dir> [options]");
    });

    it ("should properly parse single number range", () => {
        const args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(7);
    });

    it ("should properly parse empty number range", () => {
        const args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", ":"]);
        expect(args.minPageNumber).toEqual(1);
        expect(args.maxPageNumber).toEqual(null);
    });

    it ("should properly parse from: number range", () => {
        const args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7:"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(null);
    });

    it ("should properly parse :to number range", () => {
        const args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", ":12"]);
        expect(args.minPageNumber).toEqual(1);
        expect(args.maxPageNumber).toEqual(12);
    });

    it ("should properly parse from:to number range", () => {
        const args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7:12"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(12);
    });

    it ("should properly throw exception on range with non-number elements", () => {
        expect(() => {
            argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "a:b"]);
        }).toThrowError("Invalid page range in -l/--limit-to option (element \"a\" is not a number)");

    });

    it ("should properly throw exception on range with too many elements", () => {
        expect(() => {
            argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "1:2:3"]);
        }).toThrowError("Invalid page range in -l/--limit-to option (too many colons)");
    });

    it ("should set append-name flag", () => {
        const args = argumentParser.getArguments(
            ["-u", "zyx", "-o", "qbc", "--append-name"],
        );
        expect(args.appendName).toEqual(true);
        expect(args.appendCategory).toEqual(false);
    });

    it ("should set append-category flag", () => {
        const args = argumentParser.getArguments(
            ["-u", "zyx", "-o", "qbc", "--append-category"],
        );
        expect(args.appendName).toEqual(false);
        expect(args.appendCategory).toEqual(true);
    });

    it ("should set append-name and append-category flags", () => {
        const args = argumentParser.getArguments(
            ["-u", "zyx", "-o", "qbc", "--append-category-name"],
        );
        expect(args.appendName).toEqual(true);
        expect(args.appendCategory).toEqual(true);
    });
});
