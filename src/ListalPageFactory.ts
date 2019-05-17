import IFileNamingStrategy from "./IFileNamingStrategy";
import ListalPage from "./ListalPage";

export default class ListalPageFactory {
    private namingStrategy;
    private fetch;

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
            throw Error("Sorry, lists are currently not supported.");
        }
        return new ListalPage(this.fetch, this.namingStrategy, url, pageNumber);
    }

    private isListPage(url: string): boolean {
        return url.match(/\/list\//) !== null;
    }
}
