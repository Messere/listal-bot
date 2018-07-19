"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentParser_1 = require("./ArgumentParser");
describe("Command line arguments", function () {
    var argumentParser;
    beforeEach(function () {
        argumentParser = new ArgumentParser_1.default();
    });
    it("should parse short command line options", function () {
        var args = argumentParser.getArguments(["-u", "abc", "-o", "xyz", "-h", "-x", "-t", "15", "-k", "-b",
            "-c", "20", "-p", "30", "-r", "100", "-a", "-l", "10:100"]);
        expect(args).toEqual({
            appendCategory: true,
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            help: true,
            maxPageNumber: 100,
            minPageNumber: 10,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });
    it("should parse long command line options", function () {
        var args = argumentParser.getArguments(["--url", "abc", "--output", "xyz", "--help", "--overwrite", "--append-category",
            "--timeout", "15", "--concurrency", "20", "--page-concurrency", "30",
            "--retries", "100", "--append-name", "--limit-to", "10:100",
            "--append-category-name"]);
        expect(args).toEqual({
            appendCategory: true,
            appendName: true,
            concurrentImageDownloadsNumber: 20,
            concurrentPageDownloadsNumber: 30,
            destinationDir: "xyz",
            help: true,
            maxPageNumber: 100,
            minPageNumber: 10,
            overwriteExisting: true,
            retries: 100,
            timeoutSeconds: 15,
            url: "abc",
        });
    });
    it("should return only default values", function () {
        var args = argumentParser.getArguments([]);
        expect(args).toEqual({
            appendCategory: false,
            appendName: false,
            concurrentImageDownloadsNumber: 15,
            concurrentPageDownloadsNumber: 5,
            destinationDir: undefined,
            help: false,
            maxPageNumber: null,
            minPageNumber: 1,
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
    it("should properly parse single number range", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(7);
    });
    it("should properly parse empty number range", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", ":"]);
        expect(args.minPageNumber).toEqual(1);
        expect(args.maxPageNumber).toEqual(null);
    });
    it("should properly parse from: number range", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7:"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(null);
    });
    it("should properly parse :to number range", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", ":12"]);
        expect(args.minPageNumber).toEqual(1);
        expect(args.maxPageNumber).toEqual(12);
    });
    it("should properly parse from:to number range", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "7:12"]);
        expect(args.minPageNumber).toEqual(7);
        expect(args.maxPageNumber).toEqual(12);
    });
    it("should properly throw exception on range with non-number elements", function () {
        expect(function () {
            argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "a:b"]);
        }).toThrowError("Invalid page range in -l/--limit-to option (element \"a\" is not a number)");
    });
    it("should properly throw exception on range with too many elements", function () {
        expect(function () {
            argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "-l", "1:2:3"]);
        }).toThrowError("Invalid page range in -l/--limit-to option (too many colons)");
    });
    it("should set append-name flag", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "--append-name"]);
        expect(args.appendName).toEqual(true);
        expect(args.appendCategory).toEqual(false);
    });
    it("should set append-category flag", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "--append-category"]);
        expect(args.appendName).toEqual(false);
        expect(args.appendCategory).toEqual(true);
    });
    it("should set append-name and append-category flags", function () {
        var args = argumentParser.getArguments(["-u", "zyx", "-o", "qbc", "--append-category-name"]);
        expect(args.appendName).toEqual(true);
        expect(args.appendCategory).toEqual(true);
    });
});
