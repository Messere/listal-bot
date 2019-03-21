import * as FormData from "form-data";
import IFileNamingStrategy from "./IFileNamingStrategy";
import IImageInfo from "./IImageInfo";
import ListalPage from "./ListalPage";

export default class ListalListPage extends ListalPage {
    private readonly listIdRegexp = /data-listid='(\d+)'/;
    private readonly itemTotalRegexp = /data-itemtotal='(\d+)'/;
    private readonly itemsPerPage = 42;
    private readonly apiUrl = "http://www.listal.com/item-list/";
    private readonly listPageUrlPattern = "http://www.listal.com/list/{name}";

    constructor(
        fetch: any,
        page: any,
        namingStrategy: IFileNamingStrategy,
        url: string,
        pageNumber: number = 1,
    ) {
        super(fetch, page, namingStrategy, url, pageNumber);

        this.pageUrl = this.listPageUrlPattern.replace(
            "{name}",
            this.encodeName(this.getName()),
        );
    }

    public async getImages(): Promise<IImageInfo[]> {
        const apiContents = await this.getApiContents() as {
            items: string,
            totals: string,
        };

        const imageInfos = [];

        let match;
        do {
            match = this.imageUrlRegexp.exec(apiContents.items);
            if (null !== match) {
                const url = this.fullImageUrlPattern
                    .replace("{name}", this.encodeName(this.getName()))
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
        return Math.ceil(await this.getInt(this.itemTotalRegexp, "total pages") / this.itemsPerPage);
    }

    private async getApiContents(): Promise<object> {
        const form = new FormData();
        form.append("listid", await this.getListId());
        form.append("offset", (this.pageNumber - 1) * this.itemsPerPage);

        const resource = await this.fetch(this.apiUrl, {
            body: form,
            method: "POST",
        });
        if (!resource.ok) {
            throw new Error(`Failed to download list page: ${resource.statusText}`);
        }
        return await resource.json();
    }

    private async getListId(): Promise<number> {
        return this.getInt(this.listIdRegexp, "custom list id");
    }

    private async getInt(regexp: RegExp, objectName: string): Promise<number> {
        const pageContents = await this.getPageContents();
        const match = pageContents.match(regexp);
        if (match === null) {
            throw new Error(`Cannot find ${objectName}`);
        }

        const intVal = parseInt(match[1], 10);
        if (isNaN(intVal)) {
            throw new Error(`Invalid ${objectName} = "${match[1]}"`);
        }

        return Promise.resolve(intVal);
    }
}
