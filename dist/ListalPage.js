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
Object.defineProperty(exports, "__esModule", { value: true });
var ListalPage = /** @class */ (function () {
    function ListalPage(fetch, namingStrategy, logger, url, pageNumber) {
        if (pageNumber === void 0) { pageNumber = 1; }
        this.pageUrlPattern = "http://www.listal.com/{name}/pictures//{pageNumber}";
        this.fullImageUrlPattern = "http://ilarge.lisimg.com/image/{imageId}/10000full-{name}.jpg";
        this.nextPageFragmentRegexp = /<a href='\/[^\/]+\/pictures\/\/(\d+)'>Next &#187;<\/a>/;
        this.listalPageRegexp = /https?:\/\/www\.listal\.com\/([^\/]+)/i;
        this.imageUrlRegexp = /https?:\/\/www\.listal\.com\/viewimage\/(\d+)/g;
        this.pagerUrlRegexp = /[^\/]+\/pictures\/\/(\d+)/g;
        this.fetch = fetch;
        this.logger = logger;
        this.namingStrategy = namingStrategy;
        this.name = this.getNameFromUrl(url);
        this.pageUrl = this.pageUrlPattern
            .replace("{name}", this.name)
            .replace("{pageNumber}", pageNumber.toString());
    }
    ListalPage.prototype.getName = function () {
        var name;
        try {
            name = decodeURIComponent(this.name);
        }
        catch (e) {
            name = this.name;
        }
        return name;
    };
    ListalPage.prototype.getUrl = function () {
        return this.pageUrl;
    };
    ListalPage.prototype.getImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pageContents, imageInfos, match, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPageContents()];
                    case 1:
                        pageContents = _a.sent();
                        imageInfos = [];
                        do {
                            match = this.imageUrlRegexp.exec(pageContents);
                            if (null !== match) {
                                url = this.fullImageUrlPattern.replace("{name}", this.name).replace("{imageId}", match[1]);
                                imageInfos.push({
                                    fileName: this.namingStrategy.getFileName(url),
                                    retries: 0,
                                    url: url,
                                });
                            }
                        } while (match);
                        return [2 /*return*/, imageInfos];
                }
            });
        });
    };
    ListalPage.prototype.getTotalPages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pageContents, totalPages, match, page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPageContents()];
                    case 1:
                        pageContents = _a.sent();
                        totalPages = 1;
                        do {
                            match = this.pagerUrlRegexp.exec(pageContents);
                            if (null !== match) {
                                page = parseInt(match[1], 10);
                                if (page > totalPages) {
                                    totalPages = page;
                                }
                            }
                        } while (match);
                        return [2 /*return*/, Promise.resolve(totalPages)];
                }
            });
        });
    };
    ListalPage.prototype.getPageContents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resource, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.pageContents === undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fetch(this.pageUrl)];
                    case 1:
                        resource = _b.sent();
                        if (!resource.ok) {
                            throw new Error("Failed to download listal page " + this.pageUrl + ", error: " + resource.statusText);
                        }
                        _a = this;
                        return [4 /*yield*/, resource.text()];
                    case 2:
                        _a.pageContents = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve(this.pageContents)];
                }
            });
        });
    };
    ListalPage.prototype.getNameFromUrl = function (url) {
        var match = url.match(this.listalPageRegexp);
        if (match !== null) {
            return match[1];
        }
        else if (url.match(/^https?:\/\//i) === null) {
            // name was provided instead of url
            return url;
        }
        else {
            throw new Error("Unrecognized listal url: \"" + url + "\"");
        }
    };
    return ListalPage;
}());
exports.default = ListalPage;
