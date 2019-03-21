import IFileNamingStrategy from "./IFileNamingStrategy";
import IImageInfo from "./IImageInfo";

export default class ListalPage {
    protected pageNumber: number;
    protected fetch: any;
    protected page: any;
    protected namingStrategy: IFileNamingStrategy;
    protected pageUrl: string;

    protected readonly imageUrlRegexp = /\/viewimage\/(\d+)/g;
    protected readonly fullImageUrlPattern = "http://ilarge.lisimg.com/image/{imageId}/10000full-{name}.jpg";

    private readonly pageUrlPattern = "http://www.listal.com/{type}/{name}/pictures/{pageNumber}";
    private readonly pagePersonUrlPattern = "http://www.listal.com/{name}/pictures//{pageNumber}";
    private readonly listalPageRegexp = /https?:\/\/www\.listal\.com\/([a-z_-]+)\/([^\/]+)/i;
    private readonly listalPersonPageRegexp = /https?:\/\/www\.listal\.com\/([^\/]+)/i;

    private pagerUrlRegexp;

    private name: string;
    private category: string;
    private pageContents: string;

    constructor(
        fetch: any,
        page: any,
        namingStrategy: IFileNamingStrategy,
        url: string,
        pageNumber: number = 1,
    ) {
        this.pageNumber = pageNumber;
        this.fetch = fetch;
        this.page = page;
        this.namingStrategy = namingStrategy;
        [this.category, this.name] = this.getTypeAndNameFromUrl(url);

        this.pageUrl = this.makePageUrl(this.category, this.name, this.pageNumber);
        this.pagerUrlRegexp = new RegExp(
            (this.category === null ? "" : `${this.category}/`) + "[^/]+/pictures(?:/+)(\\d+)",
            "g",
        );
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

    public getCategory(): string {
        return this.category === null ? "person" : this.category;
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
        if (this.pageNumber !== 1) {
            throw new Error("Only first page contains proper number of pages");
        }

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

    protected async getPageContents(): Promise<string> {
        if (this.page.url().match('/pictures[/]+' + this.pageNumber + '$')) {
            this.pageContents = await this.page.content();
        } else if (this.pageContents === undefined) {
            if (this.page.url() != 'about:blank') {
                console.log(`click ${this.pageNumber}`)
                await this.page.click('a[href$="/pictures/'+this.pageNumber+'"]')
                console.log('wait')
                await this.page.waitForNavigation({waitUntil: 'load'})
            } else {
                console.log(`goto ${this.pageUrl}`)
                await this.page.goto(this.pageUrl);
                console.log('accept')
                await this.page.click('button.qc-cmp-button')
            }
            this.pageContents = await this.page.content();
        }
        return Promise.resolve(this.pageContents);
    }

    protected encodeName(name: string): string {
        return /^[\u0000-\u007f]*$/.test(name) ? name : encodeURIComponent(name);
    }

    private getTypeAndNameFromUrl(url: string): string[] {
        const match = url.match(this.listalPageRegexp);
        if (match !== null && match[2] !== "pictures") {
            return [match[1], match[2]];
        }

        const matchPerson = url.match(this.listalPersonPageRegexp);
        if (matchPerson !== null) {
            return [null, matchPerson[1]];
        } else if (url.match(/^https?:\/\//i) === null) {
            // name was provided instead of url
            return [null, url];
        } else {
            throw new Error(`Unrecognized listal url: "${url}"`);
        }
    }

    private makePageUrl(type: string, name: string, pageNumber: number): string {
        return (type === null ? this.pagePersonUrlPattern : this.pageUrlPattern)
            .replace("{name}", this.encodeName(name))
            .replace("{type}", type)
            .replace("{pageNumber}", pageNumber.toString());
    }
}
