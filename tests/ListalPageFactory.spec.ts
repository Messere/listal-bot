import ListalListPage from "../src/ListalListPage";
import ListalPage from "../src/ListalPage";
import ListalPageFactory from "../src/ListalPageFactory";

describe("Listal page factory", () => {
    let factory: ListalPageFactory;

    beforeEach(() => {
        factory = new ListalPageFactory(
            {},
            jasmine.createSpyObj("IFileNamingStrategy", ["getName"]),
        );
    });

    it("should return regular listal page", () => {
        const page = factory.getListalPage("http://www.listal.com/some-name");
        expect(page).toEqual(jasmine.any(ListalPage));
        expect(page).not.toEqual(jasmine.any(ListalListPage));
    });

    it("should return custom list page", () => {
        const page = factory.getListalPage("http://www.listal.com/list/some-name");
        expect(page).toEqual(jasmine.any(ListalListPage));
    });
});