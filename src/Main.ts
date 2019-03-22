import IDownloaderArguments from "./IDownloaderArguments";
import IImageStats from "./IImageStats";
import ILogger from "./ILogger";
import ImageDownloader from "./ImageDownloader";
import ImageQueue from "./ImageQueue";
import ListalFileNamingStrategy from "./ListalFileNamingStrategy";
import ListalPage from "./ListalPage";
import ListalPageFactory from "./ListalPageFactory";

export default class Main {
    private logger: ILogger;
    private downloader;
    private queue;
    private fetch;

    constructor(logger: ILogger, downloader: any, fetch: any, queue: any) {
        this.logger = logger;
        this.downloader = downloader;
        this.queue = queue;
        this.fetch = fetch;
    }

    public async run(
        downloaderArguments: IDownloaderArguments,
    ) {

        const imageStats: IImageStats = {
            error: 0,
            saved: 0,
            success: 0,
            total: 0,
        };

        const listalPageFactory = new ListalPageFactory(
            this.fetch,
            new ListalFileNamingStrategy(),
        );

        const firstListalPage = listalPageFactory.getListalPage(downloaderArguments.url);

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
            concurrency: 1,
            timeout: downloaderArguments.timeoutSeconds * 5000,
        });

        const totalPages = await firstListalPage.getTotalPages();

        for (
            let pageNumber = downloaderArguments.minPageNumber < 1 ? 1 : downloaderArguments.minPageNumber;
            pageNumber <= totalPages &&
                (downloaderArguments.maxPageNumber === null || pageNumber <= downloaderArguments.maxPageNumber);
            pageNumber++
        ) {
            pageQueue.push(async () => {
                const listalPage = listalPageFactory.getListalPage(
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
                    }, 5);
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
