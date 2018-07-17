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
    it("should throw an error if url is not recognized", function () {
        expect(function () {
            namingStrategy.getFileName("http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg");
        }).toThrowError("Unrecognized listal image url: http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg");
    });
});
