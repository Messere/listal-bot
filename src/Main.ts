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
        concurrentDownloadsNumber: number = 5,
        timeoutSeconds: number = 10,
        maxRetries: number = 5,
    ) {

        const imageStats: IImageStats = {
            error: 0,
            success: 0,
            total: 0,
        };

        const imageQueue = new ImageQueue(
            imageStats,
            new ImageDownloader(this.logger, this.downloader, destinationDir, overwriteExisting),
            this.logger,
            this.queue,
            concurrentDownloadsNumber,
            timeoutSeconds,
            maxRetries,
        );

        let listalPage = new ListalPage(
            this.fetch,
            new ListalFileNamingStrategy(),
            this.logger,
            url,
        );

        this.logger.log(
            `Downloading ${overwriteExisting ? "all" : "new"} images of "${listalPage.getName()}"`,
        );

        let hasNext = true;

        while (hasNext) {
            const images = await listalPage.getImages();
            imageStats.total += images.length;

            images.forEach((imageInfo) => {
                imageQueue.push(imageInfo);
            });

            hasNext = await listalPage.hasNextPage();

            if (hasNext) {
                listalPage = await listalPage.getNextPage();
            }
        }

        return imageQueue.start();
    }
}
