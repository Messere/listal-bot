import IFileNamingStrategy from "./IFileNamingStrategy";

export default class ListalFileNamingStrategy implements IFileNamingStrategy {
    private readonly urlRegex = /https?:\/\/ilarge\.lisimg\.com\/image\/(\d+)\/\d+full-([^.]+)\.jpg/;

    public getFileName(url: string): string {
        const match = url.match(this.urlRegex);
        if (match === null) {
            throw new Error(`Unrecognized listal image url: ${url}`);
        }

        return `${match[2]}-${match[1]}.jpg`;
    }
}
