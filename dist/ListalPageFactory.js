"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListalListPage_1 = require("./ListalListPage");
var ListalPage_1 = require("./ListalPage");
var ListalPageFactory = /** @class */ (function () {
    function ListalPageFactory(fetch, page, namingStrategy) {
        this.fetch = fetch;
        this.page = page;
        this.namingStrategy = namingStrategy;
    }
    ListalPageFactory.prototype.getListalPage = function (url, pageNumber) {
        if (pageNumber === void 0) { pageNumber = 1; }
        if (this.isListPage(url)) {
            return new ListalListPage_1.default(this.fetch, this.page, this.namingStrategy, url, pageNumber);
        }
        return new ListalPage_1.default(this.fetch, this.page, this.namingStrategy, url, pageNumber);
    };
    ListalPageFactory.prototype.isListPage = function (url) {
        return url.match(/\/list\//) !== null;
    };
    return ListalPageFactory;
}());
exports.default = ListalPageFactory;
