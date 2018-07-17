import { existsSync,  lstatSync, mkdirSync } from "fs";
import IImageInfo from "./IImageInfo";
import ILogger from "./ILogger";

export default class ImageDownloader {
    private destinationDirectory: string;
    private overwriteExistingImages: boolean;
    private logger;
    private downloader;

    constructor(
        logger: ILogger,
        downloader: any,
        destinationDirectory: string,
        overwriteExistingImages: boolean = false,
    ) {
        this.logger = logger;
        this.overwriteExistingImages = overwriteExistingImages;
        this.destinationDirectory = destinationDirectory;
        this.createDirectoryIfDoesNotExist(this.destinationDirectory);
        this.downloader = downloader;
    }

    public async download(imageInfo: IImageInfo, timeout: number): Promise<void> {
        const destination = this.destinationDirectory + "/" + imageInfo.fileName;
        if (this.overwriteExistingImages || !existsSync(destination)) {
            return this.downloader.image({
                dest: destination,
                timeout: timeout * 1000,
                url: imageInfo.url,
            });
        }
    }

    private createDirectoryIfDoesNotExist(directory: string) {
        if (!existsSync(directory)) {
            mkdirSync(directory);
            this.logger.log(`Created destination directory ${directory}`);
        } else if (!lstatSync(directory).isDirectory()) {
            throw new Error(`Path ${directory} exists, but is not a directory`);
        }
    }
}
