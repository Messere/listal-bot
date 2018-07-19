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
var ImageQueue = /** @class */ (function () {
    function ImageQueue(imageStats, imageDownloader, logger, queue, concurrentDownloadsNumber, timeoutSeconds, maxRetries) {
        this.imageQueue = queue({
            autostart: true,
            concurrency: concurrentDownloadsNumber,
            timeout: timeoutSeconds * 1000,
        });
        this.timeoutSeconds = timeoutSeconds;
        this.imageStats = imageStats;
        this.imageDownloader = imageDownloader;
        this.logger = logger;
        this.maxRetries = maxRetries;
    }
    Object.defineProperty(ImageQueue.prototype, "length", {
        get: function () {
            return this.imageQueue.length;
        },
        enumerable: true,
        configurable: true
    });
    ImageQueue.prototype.push = function (imageUrl) {
        var _this = this;
        this.imageQueue.push(function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.imageDownloader.download(imageUrl, this.timeoutSeconds)];
                    case 1:
                        result = _a.sent();
                        this.imageStats.success++;
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.logger.error(e_1);
                        result = Promise.resolve();
                        imageUrl.retries += 1;
                        if (imageUrl.retries < this.maxRetries) {
                            this.logger.log("Will retry to download " + imageUrl.url + " later");
                            this.push(imageUrl);
                        }
                        else {
                            this.logger.error("Giving up on downloading " + imageUrl.url + " after " + this.maxRetries + " attempts");
                            this.imageStats.error++;
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        this.logger.progress(this.imageStats);
                        return [2 /*return*/, result];
                }
            });
        }); });
    };
    ImageQueue.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.imageQueue.start(function (error) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    };
    return ImageQueue;
}());
exports.default = ImageQueue;
