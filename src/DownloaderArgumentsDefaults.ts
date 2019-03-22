import IDownloaderArguments from "./IDownloaderArguments";

const defaults = {
    appendCategory: false,
    appendName: false,
    concurrentImageDownloadsNumber: 6,
    destinationDir: undefined,
    maxPageNumber: null,
    minPageNumber: 1,
    overwriteExisting: false,
    retries: 5,
    showHelp: false,
    showVersion: false,
    timeoutSeconds: 5,
    url: undefined,
} as IDownloaderArguments;

export default defaults;
