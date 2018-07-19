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
var ListalListPage_1 = require("./ListalListPage");
describe("Listal list page", function () {
    var namingStrategy;
    var fetch;
    beforeEach(function () {
        namingStrategy = new ListalFileNamingStrategy_1.default();
        fetch = function () {
            return Promise.resolve({
                json: function () { return Promise.resolve(JSON.parse(readFile.sync("tests/fixtures/listal-page-list-api.json").toString())); },
                ok: true,
                text: function () { return Promise.resolve(readFile.sync("tests/fixtures/listal-page-list.html").toString()); },
            });
        };
    });
    it("should properly get page name, category and url from other category url", function () {
        var page = new ListalListPage_1.default(fetch, namingStrategy, "http://www.listal.com/list/some-name", 5);
        expect(page.getName()).toEqual("some-name");
        expect(page.getCategory()).toEqual("list");
        expect(page.getUrl()).toEqual("http://www.listal.com/list/some-name");
    });
    it("should parse images from list page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, images;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = new ListalListPage_1.default(fetch, namingStrategy, "http://www.listal.com/list/som%C3%A9-nam%C3%A9", 5);
                    return [4 /*yield*/, page.getImages()];
                case 1:
                    images = _a.sent();
                    expect(images.length).toEqual(42);
                    [
                        8685562, 4166773, 15189795, 9438731, 6424714, 9566123,
                        8158306, 8594105, 6287219, 6324168, 6428862, 15402716,
                        9618243, 7373402, 12104537, 8220274, 6668647, 9600817,
                        14024437, 15018382, 6482558, 2524418, 982102, 4443730,
                        13433571, 6386227, 5092816, 7899250, 2433489, 2869870,
                        6077339, 15119482, 6756194, 4498292, 6343610, 9605425,
                        15402714, 14335762, 2587120, 15207276, 5672848, 9019188,
                    ].forEach(function (id, idx) {
                        expect(images[idx]).toEqual({
                            fileName: "som\u00E9-nam\u00E9-" + id + ".jpg",
                            retries: 0,
                            url: "http://ilarge.lisimg.com/image/" + id + "/10000full-som%C3%A9-nam%C3%A9.jpg",
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should get total number of pages from list page", function () { return __awaiter(_this, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    page = new ListalListPage_1.default(fetch, namingStrategy, "http://www.listal.com/some-name", 1);
                    _a = expect;
                    return [4 /*yield*/, page.getTotalPages()];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual(12);
                    return [2 /*return*/];
            }
        });
    }); });
});
