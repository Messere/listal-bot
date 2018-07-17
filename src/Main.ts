import IImageStats from "./IImageStats";
import ILogger from "./ILogger";
import ImageDownloader from "./ImageDownloader";
import ImageQueue from "./ImageQueue";
import ListalFileNamingStrategy from "./ListalFileNamingStrategy";
import ListalPage from "./ListalPage";

export default class Main {
    private logger: ILogger;
    private downloader;

    constructor(logger: ILogger, downloader: any) {
        this.logger = logger;
        this.downloader = downloader;
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
            concurrentDownloadsNumber,
            timeoutSeconds,
            maxRetries,
        );

        let listalPage = new ListalPage(
            new ListalFileNamingStrategy(),
            this.logger,
            url,
        );

        this.logger.log(
            `Downloading ${overwriteExisting ? "all" : "new"} images of "${listalPage.getName()}"`,
        );

        let hasNext = true;

        while (hasNext) {
            const imageUrls = await listalPage.getImageUrls();
            imageStats.total += imageUrls.length;

            imageUrls.forEach((imageUrl) => {
                imageQueue.push(imageUrl);
            });

            hasNext = await listalPage.hasNextPage();

            if (hasNext) {
                listalPage = await listalPage.getNextPage();
            }
        }

        return imageQueue.start();
    }
}
