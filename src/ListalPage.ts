import IFileNamingStrategy from "./IFileNamingStrategy";
import IImageInfo from "./IImageInfo";
import ILogger from "./ILogger";

export default class ListalPage {
    private readonly pageUrlPattern = "http://www.listal.com/{name}/pictures//{pageNumber}";
    private readonly fullImageUrlPattern = "http://ilarge.lisimg.com/image/{imageId}/10000full-{name}.jpg";
    private readonly nextPageFragmentRegexp = /<a href='\/[^\/]+\/pictures\/\/(\d+)'>Next &#187;<\/a>/;
    private readonly listalPageRegexp = /https?:\/\/www\.listal\.com\/([^\/]+)/i;
    private readonly imageUrlRegexp = /https?:\/\/www\.listal\.com\/viewimage\/(\d+)/g;

    private name: string;
    private pageUrl: string;
    private pageContents: string;
    private logger: ILogger;
    private namingStrategy: IFileNamingStrategy;
    private fetch: any;

    constructor(
        fetch: any,
        namingStrategy: IFileNamingStrategy,
        logger: ILogger,
        url: string,
        pageNumber: number = 1,
    ) {
        this.fetch = fetch;
        this.logger = logger;
        this.namingStrategy = namingStrategy;
        this.name = this.getNameFromUrl(url);

        this.pageUrl = this.pageUrlPattern
            .replace("{name}", this.name)
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
                const url = this.fullImageUrlPattern.replace("{name}", this.name).replace("{imageId}", match[1]);
                imageInfos.push({
                    fileName: this.namingStrategy.getFileName(url),
                    retries: 0,
                    url,
                });
            }
        } while (match);

        return imageInfos;
    }

    public async hasNextPage(): Promise<boolean> {
        const pageContents = await this.getPageContents();
        return Promise.resolve(
            null !== pageContents.match(this.nextPageFragmentRegexp),
        );
    }

    public async getNextPage(): Promise<ListalPage> {
        const pageContents = await this.getPageContents();
        const pageNumberMatch = pageContents.match(this.nextPageFragmentRegexp);
        if (pageNumberMatch === null) {
            throw new Error("Cannot find next page url");
        }
        const nextPageNumber = parseInt(pageNumberMatch[1], 10);
        return Promise.resolve(
            new ListalPage(this.fetch, this.namingStrategy, this.logger, this.pageUrl, nextPageNumber),
        );
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
        } else {
            throw new Error(`Unrecognized listal url: "${url}"`);
        }
    }
}
