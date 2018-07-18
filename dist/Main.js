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
var ImageDownloader_1 = require("./ImageDownloader");
var ImageQueue_1 = require("./ImageQueue");
var ListalFileNamingStrategy_1 = require("./ListalFileNamingStrategy");
var ListalPage_1 = require("./ListalPage");
var Main = /** @class */ (function () {
    function Main(logger, downloader, fetch, queue) {
        this.logger = logger;
        this.downloader = downloader;
        this.fetch = fetch;
        this.queue = queue;
    }
    Main.prototype.run = function (url, destinationDir, overwriteExisting, concurrentDownloadsNumber, timeoutSeconds, maxRetries) {
        if (concurrentDownloadsNumber === void 0) { concurrentDownloadsNumber = 5; }
        if (timeoutSeconds === void 0) { timeoutSeconds = 10; }
        if (maxRetries === void 0) { maxRetries = 5; }
        return __awaiter(this, void 0, void 0, function () {
            var imageStats, imageQueue, listalPage, hasNext, images;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageStats = {
                            error: 0,
                            success: 0,
                            total: 0,
                        };
                        imageQueue = new ImageQueue_1.default(imageStats, new ImageDownloader_1.default(this.logger, this.downloader, destinationDir, overwriteExisting), this.logger, this.queue, concurrentDownloadsNumber, timeoutSeconds, maxRetries);
                        listalPage = new ListalPage_1.default(this.fetch, new ListalFileNamingStrategy_1.default(), this.logger, url);
                        this.logger.log("Downloading " + (overwriteExisting ? "all" : "new") + " images of \"" + listalPage.getName() + "\"");
                        hasNext = true;
                        _a.label = 1;
                    case 1:
                        if (!hasNext) return [3 /*break*/, 6];
                        return [4 /*yield*/, listalPage.getImages()];
                    case 2:
                        images = _a.sent();
                        imageStats.total += images.length;
                        images.forEach(function (imageInfo) {
                            imageQueue.push(imageInfo);
                        });
                        return [4 /*yield*/, listalPage.hasNextPage()];
                    case 3:
                        hasNext = _a.sent();
                        if (!hasNext) return [3 /*break*/, 5];
                        return [4 /*yield*/, listalPage.getNextPage()];
                    case 4:
                        listalPage = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, imageQueue.start()];
                }
            });
        });
    };
    return Main;
}());
exports.default = Main;
