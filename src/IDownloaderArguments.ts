export default interface IDownloaderArguments {
    url: string;
    destinationDir: string;
    help: boolean;
    overwriteExisting: boolean;
    retries: number;
    concurrentDownloadsNumber: number;
    timeoutSeconds: number;
}
