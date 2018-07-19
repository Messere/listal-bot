"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListalFileNamingStrategy_1 = require("./ListalFileNamingStrategy");
describe("ListalFileNamingStrategy", function () {
    var namingStrategy;
    beforeEach(function () {
        namingStrategy = new ListalFileNamingStrategy_1.default();
    });
    it("should make the name based on url", function () {
        expect(namingStrategy.getFileName("http://ilarge.lisimg.com/image/123456/1234342full-some-name.jpg")).toEqual("some-name-123456.jpg");
    });
    it("should decode encoded name in url", function () {
        expect(namingStrategy.getFileName("http://ilarge.lisimg.com/image/123456/1234342full-som%C3%A9-nam%C3%A9.jpg")).toEqual("somé-namé-123456.jpg");
    });
    it("should leave original name if url is encoded not properly", function () {
        expect(namingStrategy.getFileName("http://ilarge.lisimg.com/image/123456/1234342full-som%A9-nam%A9.jpg")).toEqual("som%A9-nam%A9-123456.jpg");
    });
    it("should throw an error if url is not recognized", function () {
        expect(function () {
            namingStrategy.getFileName("http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg");
        }).toThrowError("Unrecognized listal image url: http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg");
    });
    it("should allow for dot in name", function () {
        expect(namingStrategy.getFileName("http://ilarge.lisimg.com/image/123456/1234342full-some-name.with.dots.jpg")).toEqual("some-name.with.dots-123456.jpg");
    });
});
