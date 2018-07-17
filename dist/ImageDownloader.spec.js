"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var mockFs = require("mock-fs");
var ImageDownloader_1 = require("./ImageDownloader");
describe("Image downloader", function () {
    var logger;
    var downloader;
    beforeEach(function () {
        logger = jasmine.createSpyObj("ILogger", ["log"]);
        downloader = jasmine.createSpyObj("downlaoder", ["image"]);
        mockFs({
            output1: {
                "file.jpeg": "jpeg inside",
            },
            outputFile: "i'm a file",
        });
    });
    afterEach(function () {
        mockFs.restore();
    });
    it("should create destination directory if it does not exist", function () {
        expect(fs_1.existsSync("output2")).toBeFalsy();
        var imageDownloader = new ImageDownloader_1.default(logger, downloader, "output2");
        expect(fs_1.existsSync("output2")).toBeTruthy();
    });
    it("should throw error if destination path is not a directory", function () {
        expect(function () {
            var imageDownloader = new ImageDownloader_1.default(logger, downloader, "outputFile");
        }).toThrowError("Path outputFile exists, but is not a directory");
    });
    it("should download new image", function () {
        var imageDownloader = new ImageDownloader_1.default(logger, downloader, "output1");
        imageDownloader.download({
            fileName: "image.jpeg",
            retries: 0,
            url: "http://get.me",
        }, 10);
        expect(downloader.image).toHaveBeenCalledWith({
            dest: "output1/image.jpeg",
            timeout: 10000,
            url: "http://get.me",
        });
    });
    it("should not overwrite existing image", function () {
        var imageDownloader = new ImageDownloader_1.default(logger, downloader, "output1");
        imageDownloader.download({
            fileName: "file.jpeg",
            retries: 0,
            url: "http://get.me",
        }, 10);
        expect(downloader.image).toHaveBeenCalledTimes(0);
    });
    it("should overwrite existing image if overwirte flag is set", function () {
        var imageDownloader = new ImageDownloader_1.default(logger, downloader, "output1", true);
        imageDownloader.download({
            fileName: "file.jpeg",
            retries: 0,
            url: "http://get.me",
        }, 10);
        expect(downloader.image).toHaveBeenCalledWith({
            dest: "output1/file.jpeg",
            timeout: 10000,
            url: "http://get.me",
        });
    });
});
