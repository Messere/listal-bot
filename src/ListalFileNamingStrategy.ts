import IFileNamingStrategy from "./IFileNamingStrategy";

export default class ListalFileNamingStrategy implements IFileNamingStrategy {
    private readonly urlRegex = /https?:\/\/ilarge\.lisimg\.com\/image\/(\d+)\/\d+full-([^.]+)\.jpg/;

    public getFileName(url: string): string {
        const match = url.match(this.urlRegex);
        if (match === null) {
            throw new Error(`Unrecognized listal image url: ${url}`);
        }
        let name;
        try {
            name = decodeURIComponent(match[2]);
        } catch (e) {
            name = match[2];
        }
        return `${name}-${match[1]}.jpg`;
    }
}
