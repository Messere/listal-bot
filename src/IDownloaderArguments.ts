export default interface IDownloaderArguments {
    url: string;
    destinationDir: string;
    appendName: boolean;
    help: boolean;
    overwriteExisting: boolean;
    retries: number;
    concurrentDownloadsNumber: number;
    timeoutSeconds: number;
}
