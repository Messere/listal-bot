export default interface IDownloaderArguments {
    url: string;
    destinationDir: string;
    appendName: boolean;
    appendCategory: boolean;
    showHelp: boolean;
    showVersion: boolean;
    overwriteExisting: boolean;
    retries: number;
    concurrentImageDownloadsNumber: number;
    concurrentPageDownloadsNumber: number;
    timeoutSeconds: number;
    minPageNumber: number;
    maxPageNumber: number;
}
