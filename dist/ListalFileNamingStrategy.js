"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListalFileNamingStrategy = /** @class */ (function () {
    function ListalFileNamingStrategy() {
        this.urlRegex = /https?:\/\/ilarge\.lisimg\.com\/image\/(\d+)\/\d+full-(.+)\.jpg/;
    }
    ListalFileNamingStrategy.prototype.getFileName = function (url) {
        var match = url.match(this.urlRegex);
        if (match === null) {
            throw new Error("Unrecognized listal image url: " + url);
        }
        var name;
        try {
            name = decodeURIComponent(match[2]);
        }
        catch (e) {
            name = match[2];
        }
        return name + "-" + match[1] + ".jpg";
    };
    return ListalFileNamingStrategy;
}());
exports.default = ListalFileNamingStrategy;
