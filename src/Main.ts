import IDownloaderArguments from "./IDownloaderArguments";
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
        downloaderArguments: IDownloaderArguments,
    ) {

        const imageStats: IImageStats = {
            error: 0,
            success: 0,
            total: 0,
        };

        const firstListalPage = new ListalPage(
            this.fetch,
            new ListalFileNamingStrategy(),
            downloaderArguments.url,
        );

        const imageQueue = new ImageQueue(
            imageStats,
            new ImageDownloader(
                this.logger,
                this.downloader,
                this.getDestinationDir(firstListalPage, downloaderArguments),
                downloaderArguments.overwriteExisting,
            ),
            this.logger,
            this.queue,
            downloaderArguments.concurrentImageDownloadsNumber,
            downloaderArguments.timeoutSeconds,
            downloaderArguments.retries,
        );

        this.logger.log(
            `Downloading ${downloaderArguments.overwriteExisting ? "all" : "new"}` +
            ` images of ${firstListalPage.getCategory()} "${firstListalPage.getName()}"`,
        );

        const pageQueue = this.queue({
            autostart: true,
            concurrency: downloaderArguments.concurrentPageDownloadsNumber,
            timeout: downloaderArguments.timeoutSeconds * 1000,
        });

        const totalPages = await firstListalPage.getTotalPages();

        for (
            let pageNumber = downloaderArguments.minPageNumber < 1 ? 1 : downloaderArguments.minPageNumber;
            pageNumber <= totalPages &&
                (downloaderArguments.maxPageNumber === null || pageNumber <= downloaderArguments.maxPageNumber);
            pageNumber++
        ) {
            pageQueue.push(async () => {
                const listalPage = new ListalPage(
                    this.fetch,
                    new ListalFileNamingStrategy(),
                    downloaderArguments.url,
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

    private getDestinationDir(
        listalPage: ListalPage,
        downloaderArguments: IDownloaderArguments,
    ): string {
        let destinationDir = downloaderArguments.destinationDir;

        if (downloaderArguments.appendCategory) {
            destinationDir += `/${listalPage.getCategory()}`;
        }

        if (downloaderArguments.appendName) {
            destinationDir += `/${listalPage.getName()}`;
        }
        return destinationDir;
    }
}
