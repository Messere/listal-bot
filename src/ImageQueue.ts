import IImageInfo from "./IImageInfo";
import IImageStats from "./IImageStats";
import ILogger from "./ILogger";
import ImageDownloader from "./ImageDownloader";

export default class ImageQueue {
    private imageQueue;
    private imageStats;
    private imageDownloader;
    private timeoutSeconds;
    private logger;
    private maxRetries;

    constructor(
        imageStats: IImageStats,
        imageDownloader: ImageDownloader,
        logger: ILogger,
        queue: any,
        concurrentDownloadsNumber: number,
        timeoutSeconds: number,
        maxRetries: number,
    ) {
        this.imageQueue = queue({
            autostart: true,
            concurrency: concurrentDownloadsNumber,
            timeout: timeoutSeconds * 1000,
        });
        this.timeoutSeconds = timeoutSeconds;
        this.imageStats = imageStats;
        this.imageDownloader = imageDownloader;
        this.logger = logger;
        this.maxRetries = maxRetries;
    }

    get length() {
        return this.imageQueue.length;
    }

    public push(imageUrl: IImageInfo): void {
        this.imageQueue.push(async () => {
            let result;
            try {
                result = await this.imageDownloader.download(imageUrl, this.timeoutSeconds);
                this.imageStats.success++;
            } catch (e) {
                this.logger.error(e);
                result = Promise.resolve();
                imageUrl.retries += 1;
                if (imageUrl.retries < this.maxRetries) {
                    this.logger.log(`Will retry to download ${imageUrl.url} later`);
                    this.push(imageUrl);
                } else {
                    this.logger.error(`Giving up on downloading ${imageUrl.url} after ${this.maxRetries} attempts`);
                    this.imageStats.error++;
                }
            }
            this.logger.progress(this.imageStats);
            return result;
        });
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.imageQueue.start((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}
