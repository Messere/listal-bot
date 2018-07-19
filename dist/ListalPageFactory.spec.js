"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListalListPage_1 = require("./ListalListPage");
var ListalPage_1 = require("./ListalPage");
var ListalPageFactory_1 = require("./ListalPageFactory");
describe("Listal page factory", function () {
    var factory;
    beforeEach(function () {
        factory = new ListalPageFactory_1.default({}, jasmine.createSpyObj("IFileNamingStrategy", ["getName"]));
    });
    it("should return regular listal page", function () {
        var page = factory.getListalPage("http://www.listal.com/some-name");
        expect(page).toEqual(jasmine.any(ListalPage_1.default));
        expect(page).not.toEqual(jasmine.any(ListalListPage_1.default));
    });
    it("should return custom list page", function () {
        var page = factory.getListalPage("http://www.listal.com/list/some-name");
        expect(page).toEqual(jasmine.any(ListalListPage_1.default));
    });
});
