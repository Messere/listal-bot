import IImageInfo from "./IImageInfo";
import IImageStats from "./IImageStats";
import ImageQueue from "./ImageQueue";

describe("Image queue", () => {
    let imageStats;
    let imageDownloader;
    let imageDownloaderFailure;
    let logger;
    let queueContents;
    let queue;

    const createImageQueue = (downloader) => new ImageQueue(
        imageStats,
        downloader,
        logger,
        queue,
        1,
        10,
        2,
    );

    beforeEach(() => {
        imageStats = {
            error: 0,
            success: 0,
            total: 10,
        } as IImageStats;

        imageDownloader = {
            download: async (url: string, timeout: number) => Promise.resolve(),
        };

        imageDownloaderFailure = {
            download: async (url: string, timeout: number) => Promise.reject(),
        };

        logger = jasmine.createSpyObj("ILogger", ["log", "error", "progress"]);

        queueContents = [];
        queue = () => queueContents;
    });

    it("should add job to queue", () => {
        const imageQueue = createImageQueue(imageDownloader);
        imageQueue.push({
            fileName: "test.jpg",
            retries: 0,
            url: "http://come.and.get.me/",
        } as IImageInfo);

        expect(queueContents.length).toEqual(1);
    });

    it("should update image stats after successful download", async () => {
        const imageQueue = createImageQueue(imageDownloader);
        imageQueue.push({
            fileName: "test.jpg",
            retries: 0,
            url: "http://come.and.get.me/",
        } as IImageInfo);

        await queueContents[0]();

        const expectedStats = {
            error: 0,
            success: 1,
            total: 10,
        };

        expect(imageStats).toEqual(expectedStats);
        expect(logger.error).toHaveBeenCalledTimes(0);
        expect(logger.log).toHaveBeenCalledTimes(0);
        expect(logger.progress).toHaveBeenCalledWith(expectedStats);
    });

    it("should re-queue job after failure", async () => {
        const imageQueue = createImageQueue(imageDownloaderFailure);
        imageQueue.push({
            fileName: "test.jpg",
            retries: 0,
            url: "http://come.and.get.me/",
        } as IImageInfo);

        await queueContents[0]();

        const expectedStats = {
            error: 0,
            success: 0,
            total: 10,
        };

        expect(queueContents.length).toEqual(2);

        expect(imageStats).toEqual(expectedStats);
        expect(logger.error).toHaveBeenCalledTimes(1);
        expect(logger.log).toHaveBeenCalledWith("Will retry to download http://come.and.get.me/ later");
        expect(logger.progress).toHaveBeenCalledWith(expectedStats);
    });

    it("should update stats after exceeding limit of failures", async () => {
        const imageQueue = createImageQueue(imageDownloaderFailure);
        imageQueue.push({
            fileName: "test.jpg",
            retries: 1,
            url: "http://come.and.get.me/",
        } as IImageInfo);

        await queueContents[0]();

        const expectedStats = {
            error: 1,
            success: 0,
            total: 10,
        };

        expect(imageStats).toEqual(expectedStats);
        expect(logger.error).toHaveBeenCalledTimes(2);
        expect(logger.log).toHaveBeenCalledTimes(0);
        expect(logger.progress).toHaveBeenCalledWith(expectedStats);
    });

    it("should return queue length", () => {
        const imageQueue = createImageQueue(imageDownloaderFailure);

        expect(imageQueue.length).toEqual(0);

        imageQueue.push({
            fileName: "test.jpg",
            retries: 1,
            url: "http://come.and.get.me/",
        } as IImageInfo);

        expect(imageQueue.length).toEqual(1);

    });
});
