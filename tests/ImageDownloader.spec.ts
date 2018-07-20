import { existsSync } from "fs";
import * as mockFs from "mock-fs";
import IImageInfo from "../src/IImageInfo";
import ImageDownloader from "../src/ImageDownloader";

describe("Image downloader", () => {
    let logger;
    let downloader;

    beforeEach(() => {
        logger = jasmine.createSpyObj("ILogger", ["log"]);
        downloader = jasmine.createSpyObj("downlaoder", ["image"]);
        mockFs({
            output1: {
                "file.jpeg": "jpeg inside",
            },
            outputFile: "i'm a file",
        });
    });

    afterEach(() => {
        mockFs.restore();
    });

    it("should create destination directory if it does not exist", () => {
        const dir = "output2/subdir1/subdir2";
        expect(existsSync(dir)).toBeFalsy();
        // tslint:disable-next-line:no-unused-expression
        new ImageDownloader(logger, downloader, dir);
        expect(existsSync(dir)).toBeTruthy();
    });

    it("should throw error if destination path is not a directory", () => {
        expect(() => {
            // tslint:disable-next-line:no-unused-expression
            new ImageDownloader(logger, downloader, "outputFile");
        }).toThrowError("Path outputFile exists, but is not a directory");

    });

    it("should download new image", () => {
        const imageDownloader = new ImageDownloader(logger, downloader, "output1");
        imageDownloader.download({
            fileName: "image.jpeg",
            retries: 0,
            url: "http://get.me",
        } as IImageInfo, 10);
        expect(downloader.image).toHaveBeenCalledWith({
            dest: "output1/image.jpeg",
            timeout: 10000,
            url: "http://get.me",
        });
    });

    it("should not overwrite existing image", () => {
        const imageDownloader = new ImageDownloader(logger, downloader, "output1");
        imageDownloader.download({
            fileName: "file.jpeg",
            retries: 0,
            url: "http://get.me",
        } as IImageInfo, 10);
        expect(downloader.image).toHaveBeenCalledTimes(0);
    });

    it("should overwrite existing image if overwirte flag is set", () => {
        const imageDownloader = new ImageDownloader(logger, downloader, "output1", true);
        imageDownloader.download({
            fileName: "file.jpeg",
            retries: 0,
            url: "http://get.me",
        } as IImageInfo, 10);
        expect(downloader.image).toHaveBeenCalledWith({
            dest: "output1/file.jpeg",
            timeout: 10000,
            url: "http://get.me",
        });
    });
});
