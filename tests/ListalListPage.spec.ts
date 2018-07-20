import * as readFile from "read-file";
import ListalFileNamingStrategy from "../src/ListalFileNamingStrategy";
import ListalListPage from "../src/ListalListPage";

describe("Listal list page", () => {
    let namingStrategy;
    let fetch;

    beforeEach(() => {
        namingStrategy = new ListalFileNamingStrategy();
        fetch = () => {
            return Promise.resolve({
                json: () => Promise.resolve(
                    JSON.parse(
                        readFile.sync("tests/fixtures/listal-page-list-api.json").toString(),
                    ),
                ),
                ok: true,
                text: () => Promise.resolve(
                    readFile.sync("tests/fixtures/listal-page-list.html").toString(),
                ),
            });
        };
    });

    it("should properly get page name, category and url from other category url", () => {
        const page = new ListalListPage(
            fetch,
            namingStrategy,
            "http://www.listal.com/list/some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
        expect(page.getCategory()).toEqual("list");
        expect(page.getUrl()).toEqual("http://www.listal.com/list/some-name");
    });

    it("should parse images from list page", async () => {
        const page = new ListalListPage(
            fetch,
            namingStrategy,
            "http://www.listal.com/list/som%C3%A9-nam%C3%A9",
            5,
        );

        const images = await page.getImages();
        expect(images.length).toEqual(42);

        [
            8685562, 4166773, 15189795, 9438731, 6424714, 9566123,
            8158306, 8594105, 6287219, 6324168, 6428862, 15402716,
            9618243, 7373402, 12104537, 8220274, 6668647, 9600817,
            14024437, 15018382, 6482558, 2524418, 982102, 4443730,
            13433571, 6386227, 5092816, 7899250, 2433489, 2869870,
            6077339, 15119482, 6756194, 4498292, 6343610, 9605425,
            15402714, 14335762, 2587120, 15207276, 5672848, 9019188,
        ].forEach((id: number, idx: number) => {
            expect(images[idx]).toEqual({
                fileName: `somé-namé-${id}.jpg`,
                retries: 0,
                url: `http://ilarge.lisimg.com/image/${id}/10000full-som%C3%A9-nam%C3%A9.jpg`,
            });
        });
    });

    it("should get total number of pages from list page", async () => {
        const page = new ListalListPage(
            fetch,
            namingStrategy,
            "http://www.listal.com/some-name",
            1,
        );
        expect(await page.getTotalPages()).toEqual(12);
    });
});
