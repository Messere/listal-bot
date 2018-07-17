export default interface IFileNamingStrategy {
    getFileName(url: string): string;
}
