"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListalFileNamingStrategy = /** @class */ (function () {
    function ListalFileNamingStrategy() {
        this.urlRegex = /https?:\/\/ilarge\.lisimg\.com\/image\/(\d+)\/\d+full-([^.]+)\.jpg/;
    }
    ListalFileNamingStrategy.prototype.getFileName = function (url) {
        var match = url.match(this.urlRegex);
        if (match === null) {
            throw new Error("Unrecognized listal image url: " + url);
        }
        return match[2] + "-" + match[1] + ".jpg";
    };
    return ListalFileNamingStrategy;
}());
exports.default = ListalFileNamingStrategy;
