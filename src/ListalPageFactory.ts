import IFileNamingStrategy from "./IFileNamingStrategy";
import ListalListPage from "./ListalListPage";
import ListalPage from "./ListalPage";

export default class ListalPageFactory {
    private fetch;
    private namingStrategy;

    constructor(
        fetch: any,
        namingStrategy: IFileNamingStrategy,
    ) {
        this.fetch = fetch;
        this.namingStrategy = namingStrategy;
    }

    public getListalPage(
        url: string,
        pageNumber: number = 1,
    ): ListalPage {

        if (this.isListPage(url)) {
            return new ListalListPage(this.fetch, this.namingStrategy, url, pageNumber);
        }
        return new ListalPage(this.fetch, this.namingStrategy, url, pageNumber);
    }

    private isListPage(url: string): boolean {
        return url.match(/\/list\//) !== null;
    }
}
