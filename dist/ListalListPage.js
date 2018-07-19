"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var FormData = require("form-data");
var ListalPage_1 = require("./ListalPage");
var ListalListPage = /** @class */ (function (_super) {
    __extends(ListalListPage, _super);
    function ListalListPage(fetch, namingStrategy, url, pageNumber) {
        if (pageNumber === void 0) { pageNumber = 1; }
        var _this = _super.call(this, fetch, namingStrategy, url, pageNumber) || this;
        _this.listIdRegexp = /data-listid='(\d+)'/;
        _this.itemTotalRegexp = /data-itemtotal='(\d+)'/;
        _this.itemsPerPage = 42;
        _this.apiUrl = "http://www.listal.com/item-list/";
        _this.listPageUrlPattern = "http://www.listal.com/list/{name}";
        _this.pageUrl = _this.listPageUrlPattern.replace("{name}", _this.encodeName(_this.getName()));
        return _this;
    }
    ListalListPage.prototype.getImages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var apiContents, imageInfos, match, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getApiContents()];
                    case 1:
                        apiContents = _a.sent();
                        imageInfos = [];
                        do {
                            match = this.imageUrlRegexp.exec(apiContents.items);
                            if (null !== match) {
                                url = this.fullImageUrlPattern
                                    .replace("{name}", this.encodeName(this.getName()))
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
    ListalListPage.prototype.getTotalPages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Math).ceil;
                        return [4 /*yield*/, this.getInt(this.itemTotalRegexp, "total pages")];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()) / this.itemsPerPage])];
                }
            });
        });
    };
    ListalListPage.prototype.getApiContents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var form, _a, _b, _c, resource;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        form = new FormData();
                        _b = (_a = form).append;
                        _c = ["listid"];
                        return [4 /*yield*/, this.getListId()];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        form.append("offset", (this.pageNumber - 1) * this.itemsPerPage);
                        return [4 /*yield*/, this.fetch(this.apiUrl, {
                                body: form,
                                method: "POST",
                            })];
                    case 2:
                        resource = _d.sent();
                        if (!resource.ok) {
                            throw new Error("Failed to download list page: " + resource.statusText);
                        }
                        return [4 /*yield*/, resource.json()];
                    case 3: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    ListalListPage.prototype.getListId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getInt(this.listIdRegexp, "custom list id")];
            });
        });
    };
    ListalListPage.prototype.getInt = function (regexp, objectName) {
        return __awaiter(this, void 0, void 0, function () {
            var pageContents, match, intVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPageContents()];
                    case 1:
                        pageContents = _a.sent();
                        match = pageContents.match(regexp);
                        if (match === null) {
                            throw new Error("Cannot find " + objectName);
                        }
                        intVal = parseInt(match[1], 10);
                        if (isNaN(intVal)) {
                            throw new Error("Invalid " + objectName + " = \"" + match[1] + "\"");
                        }
                        return [2 /*return*/, Promise.resolve(intVal)];
                }
            });
        });
    };
    return ListalListPage;
}(ListalPage_1.default));
exports.default = ListalListPage;
