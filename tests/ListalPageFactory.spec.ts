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
    });

    it("should throw exception on list page", () => {
        let error;
        try {
            factory.getListalPage("http://www.listal.com/list/some-name");
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(new Error("Sorry, lists are currently not supported."));
    });
});
