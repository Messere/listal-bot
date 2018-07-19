import IImageStats from "./IImageStats";
import ILogger from "./ILogger";
import ImageDownloader from "./ImageDownloader";
import ImageQueue from "./ImageQueue";
import ListalFileNamingStrategy from "./ListalFileNamingStrategy";
import ListalPage from "./ListalPage";

export default class Main {
    private logger: ILogger;
    private downloader;
    private fetch;
    private queue;

    constructor(logger: ILogger, downloader: any, fetch: any, queue: any) {
        this.logger = logger;
        this.downloader = downloader;
        this.fetch = fetch;
        this.queue = queue;
    }

    public async run(
        url: string,
        destinationDir: string,
        overwriteExisting: boolean,
        appendName: boolean,
        minPageNumber: number,
        maxPageNumber: number,
        concurrentImageDownloadsNumber: number = 15,
        concurrentPageDownloadsNumber: number = 5,
        timeoutSeconds: number = 10,
        maxRetries: number = 5,
    ) {

        const imageStats: IImageStats = {
            error: 0,
            success: 0,
            total: 0,
        };

        const firstListalPage = new ListalPage(
            this.fetch,
            new ListalFileNamingStrategy(),
            this.logger,
            url,
        );

        if (appendName) {
            destinationDir += `/${firstListalPage.getName()}`;
        }

        const imageQueue = new ImageQueue(
            imageStats,
            new ImageDownloader(this.logger, this.downloader, destinationDir, overwriteExisting),
            this.logger,
            this.queue,
            concurrentImageDownloadsNumber,
            timeoutSeconds,
            maxRetries,
        );

        this.logger.log(
            `Downloading ${overwriteExisting ? "all" : "new"} images of "${firstListalPage.getName()}"`,
        );

        const pageQueue = this.queue({
            autostart: true,
            concurrency: concurrentPageDownloadsNumber,
            timeout: timeoutSeconds * 1000,
        });

        const totalPages = await firstListalPage.getTotalPages();

        for (
            let pageNumber = minPageNumber < 1 ? 1 : minPageNumber;
            pageNumber <= totalPages && (maxPageNumber === null || pageNumber <= maxPageNumber);
            pageNumber++
        ) {
            pageQueue.push(async () => {
                const listalPage = new ListalPage(
                    this.fetch,
                    new ListalFileNamingStrategy(),
                    this.logger,
                    url,
                    pageNumber,
                );
                const images = await listalPage.getImages();
                imageStats.total += images.length;
                images.forEach((imageInfo) => {
                    imageQueue.push(imageInfo);
                });
            });
        }

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                // queues look empty
                if (imageQueue.length === 0 && pageQueue.length === 0) {
                    // but give them some time...
                    setTimeout(() => {
                        // and check again
                        if (imageQueue.length === 0 && pageQueue.length === 0) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 2);
                }
            }, 1);
        });
    }
}
