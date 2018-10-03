"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger() {
        this.progressBarWidth = 30;
    }
    ConsoleLogger.prototype.log = function (text) {
        process.stdout.write(text + "\n");
    };
    ConsoleLogger.prototype.error = function (text) {
        process.stderr.write(text + "\n");
    };
    ConsoleLogger.prototype.progress = function (imageStats) {
        var percent = Math.round(((imageStats.success + imageStats.error) * 100) / imageStats.total);
        var barSize = Math.round((this.progressBarWidth * percent) / 100);
        var info = "Done " + (imageStats.success + imageStats.error) + " " +
            ("of " + imageStats.total + " (saved: " + imageStats.saved + ", errors: " + imageStats.error + ")");
        var padding = "   ";
        var paddedPercent = padding.substring(0, padding.length - percent.toString().length) + percent.toString();
        var progressBar = paddedPercent + "% [" + "=".repeat(barSize) + ">" + " ".repeat(this.progressBarWidth - barSize) + "] " + info + "\r";
        process.stdout.write(progressBar);
    };
    return ConsoleLogger;
}());
exports.default = ConsoleLogger;
