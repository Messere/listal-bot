"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentParser_1 = require("./ArgumentParser");
describe("Command line arguments", function () {
    var argumentParser;
    beforeEach(function () {
        argumentParser = new ArgumentParser_1.default();
    });
    it("should parse short command line options", function () {
        var args = argumentParser.getArguments(["-u", "abc", "-o", "xyz", "-h", "-x", "-t", "15", "-c", "20", "-p", "30", "-r", "100", "-a"]);
        expect(args).toEqual({
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            help: true,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });
    it("should parse long command line options", function () {
        var args = argumentParser.getArguments(["--url", "abc", "--output", "xyz", "--help", "--overwrite",
            "--timeout", "15", "--concurrency", "20", "--page-concurrency", "30",
            "--retries", "100", "--append-name"]);
        expect(args).toEqual({
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            help: true,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });
    it("should return only default values", function () {
        var args = argumentParser.getArguments([]);
        expect(args).toEqual({
            appendName: false,
            concurrentImageDownloadsNumber: 15,
            concurrentPageDownloadsNumber: 5,
            destinationDir: undefined,
            help: false,
            overwriteExisting: false,
            retries: 5,
            timeoutSeconds: 10,
            url: undefined,
        });
    });
    it("should say that arguments are invalid if url and directory is missing", function () {
        var args = argumentParser.getArguments([]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });
    it("should say that arguments are invalid if url is missing", function () {
        var args = argumentParser.getArguments(["-o", "zyx"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });
    it("should say that arguments are invalid if url is empty", function () {
        var args = argumentParser.getArguments(["-o", "zyx", "-u", ""]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });
    it("should say that arguemnta are invalid if directory is missing", function () {
        var args = argumentParser.getArguments(["-u", "zyx"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });
    it("should say that arguemnta are invalid if directory is empty", function () {
        var args = argumentParser.getArguments(["-o", "", "-u", "xyz"]);
        expect(argumentParser.isValid(args)).toBeFalsy();
    });
    it("should say that arguments are valid if url and dir are provided", function () {
        var args = argumentParser.getArguments(["-u", "abc", "-o", "zyx"]);
        expect(argumentParser.isValid(args)).toBeTruthy();
    });
    it("should return usage string", function () {
        expect(argumentParser.getUsage()).toContain("Usage listal-bot -u <url> -o <dir> [options]");
    });
});
