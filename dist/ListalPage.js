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
    function ListalPage(fetch, namingStrategy, url, pageNumber) {
        var _a;
        if (pageNumber === void 0) { pageNumber = 1; }
        this.imageUrlRegexp = /\/viewimage\/(\d+)/g;
        this.fullImageUrlPattern = "https://ilarge.lisimg.com/image/{imageId}/10000full-{name}.jpg";
        this.pageUrlPattern = "https://www.listal.com/{type}/{name}/pictures/{pageNumber}";
        this.pagePersonUrlPattern = "https://www.listal.com/{name}/pictures/{pageNumber}";
        this.listalPageRegexp = /https?:\/\/www\.listal\.com\/([a-z_-]+)\/([^\/]+)/i;
        this.listalPersonPageRegexp = /https?:\/\/www\.listal\.com\/([^\/]+)/i;
        this.pageNumber = pageNumber;
        this.fetch = fetch;
        this.namingStrategy = namingStrategy;
        _a = this.getTypeAndNameFromUrl(url), this.category = _a[0], this.name = _a[1];
        this.pageUrl = this.makePageUrl(this.category, this.name, this.pageNumber);
        this.pagerUrlRegexp = new RegExp((this.category === null ? "" : this.category + "/") + "[^/]+/pictures(?:/+)(\\d+)", "g");
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
    ListalPage.prototype.getCategory = function () {
        return this.category === null ? "person" : this.category;
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
                                url = this.fullImageUrlPattern
                                    .replace("{name}", this.encodeName(this.name))
                                    .replace("{imageId}", match[1]);
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
                    case 0:
                        if (this.pageNumber !== 1) {
                            throw new Error("Only first page contains proper number of pages");
                        }
                        return [4 /*yield*/, this.getPageContents()];
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
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.pageContents) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.fetch(this.pageUrl)];
                    case 1:
                        _a.pageContents = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, Promise.resolve(this.pageContents)];
                }
            });
        });
    };
    ListalPage.prototype.encodeName = function (name) {
        return /^[\u0000-\u007f]*$/.test(name) ? name : encodeURIComponent(name);
    };
    ListalPage.prototype.getTypeAndNameFromUrl = function (url) {
        var match = url.match(this.listalPageRegexp);
        if (match !== null && match[2] !== "pictures") {
            return [match[1], match[2]];
        }
        var matchPerson = url.match(this.listalPersonPageRegexp);
        if (matchPerson !== null) {
            return [null, matchPerson[1]];
        }
        else if (url.match(/^https?:\/\//i) === null) {
            // name was provided instead of url
            return [null, url];
        }
        else {
            throw new Error("Unrecognized listal url: \"" + url + "\"");
        }
    };
    ListalPage.prototype.makePageUrl = function (type, name, pageNumber) {
        return (type === null ? this.pagePersonUrlPattern : this.pageUrlPattern)
            .replace("{name}", this.encodeName(name))
            .replace("{type}", type)
            .replace("{pageNumber}", pageNumber.toString());
    };
    return ListalPage;
}());
exports.default = ListalPage;
