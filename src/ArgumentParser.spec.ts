import ArgumentParser from "./ArgumentParser";

describe("Command line arguments", () => {
    let argumentParser;

    beforeEach(() => {
        argumentParser = new ArgumentParser();
    });

    it ("should parse short command line options", () => {
        const args = argumentParser.getArguments(
            ["-u", "abc", "-o", "xyz", "-h", "-x", "-t", "15", "-c", "20", "-r", "100", "-a"],
        );
        expect(args).toEqual({
            appendName: true,
            concurrentDownloadsNumber: 20,
            destinationDir: "xyz",
            help: true,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });

    it ("should parse long command line options", () => {
        const args = argumentParser.getArguments(
            ["--url", "abc", "--output", "xyz", "--help", "--overwrite",
            "--timeout", "15", "--concurrency", "20", "--retries", "100", "--append-name"],
        );
        expect(args).toEqual({
            appendName: true,
            concurrentDownloadsNumber: 20,
            destinationDir: "xyz",
            help: true,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });

    it ("should return only default values", () => {
        const args = argumentParser.getArguments([]);
        expect(args).toEqual({
            appendName: false,
            concurrentDownloadsNumber: 5,
            destinationDir: undefined,
            help: false,
            overwriteExisting: false,
            retries: 5,
            timeoutSeconds: 10,
            url: undefined,
        });
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
});
