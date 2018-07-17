"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stdMocks = require("std-mocks");
var ConsoleLogger_1 = require("./ConsoleLogger");
describe("Console logger", function () {
    var logger;
    beforeEach(function () {
        stdMocks.use();
        logger = new ConsoleLogger_1.default();
    });
    afterEach(function () {
        stdMocks.restore();
    });
    it("should print log to stdout", function () {
        logger.log("test");
        var output = stdMocks.flush();
        expect(output.stderr).toEqual([]);
        expect(output.stdout).toEqual(["test\n"]);
    });
    it("should print error to stderr", function () {
        logger.error("test");
        var output = stdMocks.flush();
        expect(output.stdout).toEqual([]);
        expect(output.stderr).toEqual(["test\n"]);
    });
    it("should show progress bar to stdout", function () {
        logger.progress({
            error: 4,
            success: 6,
            total: 100,
        });
        var output = stdMocks.flush();
        expect(output.stderr).toEqual([]);
        expect(output.stdout).toEqual([" 10% [===>                           ] Done 10 of 100 (errors: 4)\r"]);
    });
});
