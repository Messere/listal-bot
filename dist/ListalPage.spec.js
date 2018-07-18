"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var readFile = require("read-file");
var ListalFileNamingStrategy_1 = require("./ListalFileNamingStrategy");
var ListalPage_1 = require("./ListalPage");
describe("Listal page", function () {
    var namingStrategy;
    var logger;
    var fetch;
    var fetchLast;
    beforeEach(function () {
        namingStrategy = new ListalFileNamingStrategy_1.default();
        logger = {};
        fetch = function () {
            return Promise.resolve({
                ok: true,
                text: function () { return Promise.resolve(readFile.sync("test-fixtures/listal-page.html").toString()); },
            });
        };
        fetchLast = function () {
            return Promise.resolve({
                ok: true,
                text: function () { return Promise.resolve(readFile.sync("test-fixtures/listal-page-last.html").toString()); },
            });
        };
    });
    it("should properly get page name from url", function () {
        var page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/some-name", 5);
        expect(page.getName()).toEqual("some-name");
    });
    it("should properly get encoded page name from url", function () {
        var page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/som%C3%A9-nam%C3%A9/pictures", 5);
        expect(page.getName()).toEqual("somé-namé");
    });
    it("should properly get encoded page name from url even if encoding is broken", function () {
        var page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/som%A9-nam%A9/pictures//5", 5);
        expect(page.getName()).toEqual("som%A9-nam%A9");
    });
    it("should assume that url is in fact name", function () {
        var page = new ListalPage_1.default(fetch, namingStrategy, logger, "some-name", 5);
        expect(page.getName()).toEqual("some-name");
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });
    it("should throw an error if invalid / unrecognized listal url is encountered", function () {
        expect(function () { return new ListalPage_1.default(fetch, namingStrategy, logger, "http://google.com", 5); }).toThrowError("Unrecognized listal url: \"http://google.com\"");
    });
    it("should get a proper url", function () {
        var page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/some-name", 5);
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });
    it("should parse images from page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, images, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/some-name", 5);
                    return [4 /*yield*/, page.getImages()];
                case 1:
                    images = _a.sent();
                    expect(images.length).toEqual(20);
                    ids = [
                        16492033, 16368243, 16368242, 16368240, 16368239, 16368142, 16356028, 16352875, 16339090,
                        16339053, 16323685, 16323297, 16323294, 16323293, 16323292, 16323291, 16323290, 16323289, 16323288,
                        16323286,
                    ].forEach(function (id, idx) {
                        expect(images[idx]).toEqual({
                            fileName: "some-name-" + id + ".jpg",
                            retries: 0,
                            url: "http://ilarge.lisimg.com/image/" + id + "/10000full-some-name.jpg",
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should tell that there's next page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/some-name", 5);
                    _a = expect;
                    return [4 /*yield*/, page.hasNextPage()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should get next page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, nextPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = new ListalPage_1.default(fetch, namingStrategy, logger, "http://www.listal.com/some-name", 5);
                    return [4 /*yield*/, page.getNextPage()];
                case 1:
                    nextPage = _a.sent();
                    expect(nextPage.getUrl()).toEqual("http://www.listal.com/some-name/pictures//2");
                    return [2 /*return*/];
            }
        });
    }); });
    it("should tell that there's no next page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    page = new ListalPage_1.default(fetchLast, namingStrategy, logger, "http://www.listal.com/some-name", 5);
                    _a = expect;
                    return [4 /*yield*/, page.hasNextPage()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeFalsy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw error when trying to get next page on last one", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, error, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = new ListalPage_1.default(fetchLast, namingStrategy, logger, "http://www.listal.com/some-name", 5);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, page.getNextPage()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    error = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    expect(error).toEqual(new Error("Cannot find next page url"));
                    return [2 /*return*/];
            }
        });
    }); });
});
