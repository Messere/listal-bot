import * as stdMocks from "std-mocks";
import ConsoleLogger from "./ConsoleLogger";
import IImageStats from "./IImageStats";

describe("Console logger", () => {

    let logger;

    beforeEach(() => {
        stdMocks.use();
        logger = new ConsoleLogger();
    });

    afterEach(() => {
        stdMocks.restore();
    });

    it("should print log to stdout", () => {
        logger.log("test");

        const output = stdMocks.flush();
        expect(output.stderr).toEqual([]);
        expect(output.stdout).toEqual(["test\n"]);
    });

    it("should print error to stderr", () => {
        logger.error("test");

        const output = stdMocks.flush();
        expect(output.stdout).toEqual([]);
        expect(output.stderr).toEqual(["test\n"]);
    });

    it("should show progress bar to stdout", () => {
        logger.progress({
            error: 4,
            success: 6,
            total: 100,
        } as IImageStats);

        const output = stdMocks.flush();
        expect(output.stderr).toEqual([]);
        expect(output.stdout).toEqual([" 10% [===>                           ] Done 10 of 100 (errors: 4)\r"]);
    });

});
