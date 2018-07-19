import IFileNamingStrategy from "./IFileNamingStrategy";
import IImageInfo from "./IImageInfo";

export default class ListalPage {
    private readonly pageUrlPattern = "http://www.listal.com/{name}/pictures//{pageNumber}";
    private readonly fullImageUrlPattern = "http://ilarge.lisimg.com/image/{imageId}/10000full-{name}.jpg";
    private readonly listalPageRegexp = /https?:\/\/www\.listal\.com\/([^\/]+)/i;
    private readonly imageUrlRegexp = /https?:\/\/www\.listal\.com\/viewimage\/(\d+)/g;
    private readonly pagerUrlRegexp = /[^\/]+\/pictures\/\/(\d+)/g;

    private name: string;
    private pageUrl: string;
    private pageContents: string;
    private namingStrategy: IFileNamingStrategy;
    private fetch: any;

    constructor(
        fetch: any,
        namingStrategy: IFileNamingStrategy,
        url: string,
        pageNumber: number = 1,
    ) {
        this.fetch = fetch;
        this.namingStrategy = namingStrategy;
        this.name = this.getNameFromUrl(url);

        this.pageUrl = this.pageUrlPattern
            .replace("{name}", this.encodeName(this.name))
            .replace("{pageNumber}", pageNumber.toString());
    }

    public getName(): string {
        let name;
        try {
            name = decodeURIComponent(this.name);
        } catch (e) {
            name = this.name;
        }
        return name;
    }

    public getUrl(): string {
        return this.pageUrl;
    }

    public async getImages(): Promise<IImageInfo[]> {
        const pageContents = await this.getPageContents();

        const imageInfos = [];

        let match;
        do {
            match = this.imageUrlRegexp.exec(pageContents);
            if (null !== match) {
                const url = this.fullImageUrlPattern
                    .replace("{name}", this.encodeName(this.name))
                    .replace("{imageId}", match[1]);
                imageInfos.push({
                    fileName: this.namingStrategy.getFileName(url),
                    retries: 0,
                    url,
                });
            }
        } while (match);

        return imageInfos;
    }

    public async getTotalPages(): Promise<number> {
        const pageContents = await this.getPageContents();

        let totalPages = 1;

        let match;
        do {
            match = this.pagerUrlRegexp.exec(pageContents);
            if (null !== match) {
                const page = parseInt(match[1], 10);
                if (page > totalPages) {
                    totalPages = page;
                }
            }
        } while (match);

        return Promise.resolve(totalPages);
    }

    private async getPageContents(): Promise<string> {
        if (this.pageContents === undefined) {
            const resource = await this.fetch(this.pageUrl);
            if (!resource.ok) {
                throw new Error(`Failed to download listal page ${this.pageUrl}, error: ${resource.statusText}`);
            }
            this.pageContents = await resource.text();
        }
        return Promise.resolve(this.pageContents);
    }

    private getNameFromUrl(url: string): string {
        const match = url.match(this.listalPageRegexp);
        if (match !== null) {
            return match[1];
        } else if (url.match(/^https?:\/\//i) === null) {
            // name was provided instead of url
            return url;
        } else {
            throw new Error(`Unrecognized listal url: "${url}"`);
        }
    }

    private encodeName(name: string): string {
        return /^[\u0000-\u007f]*$/.test(name) ? name : encodeURIComponent(name);
    }
}
