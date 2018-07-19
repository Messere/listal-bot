import * as readFile from "read-file";
import ListalFileNamingStrategy from "./ListalFileNamingStrategy";
import ListalPage from "./ListalPage";

describe("Listal page", () => {
    let namingStrategy;
    let fetchPerson;
    let fetchOther;

    beforeEach(() => {
        namingStrategy = new ListalFileNamingStrategy();
        fetchPerson = () => {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(
                    readFile.sync("tests/fixtures/listal-page-person.html").toString(),
                ),
            });
        };
        fetchOther = () => {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(
                    readFile.sync("tests/fixtures/listal-page-other.html").toString(),
                ),
            });
        };
    });

    it("should properly get page name, category and url from person url", () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://www.listal.com/some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
        expect(page.getCategory()).toEqual("person");
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });

    it("should properly get page name, category and url from other category url", () => {
        const page = new ListalPage(
            fetchOther,
            namingStrategy,
            "http://www.listal.com/some-category/some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
        expect(page.getCategory()).toEqual("some-category");
        expect(page.getUrl()).toEqual("http://www.listal.com/some-category/some-name/pictures/5");
    });

    it("should properly get encoded page name from url", () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://www.listal.com/som%C3%A9-nam%C3%A9/pictures",
            5,
        );
        expect(page.getName()).toEqual("somé-namé");
    });

    it("should properly get encoded page name from url even if encoding is broken", () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://www.listal.com/som%A9-nam%A9/pictures//5",
            5,
        );
        expect(page.getName()).toEqual("som%A9-nam%A9");
    });

    it("should assume that url is in fact name", () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });

    it("should throw an error if invalid / unrecognized listal url is encountered", () => {
        expect(() => new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://google.com",
            5,
        )).toThrowError("Unrecognized listal url: \"http://google.com\"");
    });

    it("should parse images from person page", async () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://www.listal.com/som%C3%A9-nam%C3%A9",
            5,
        );

        const images = await page.getImages();
        expect(images.length).toEqual(20);

        [
            16492033, 16368243, 16368242, 16368240, 16368239, 16368142, 16356028, 16352875, 16339090, 16339053,
            16323685, 16323297, 16323294, 16323293, 16323292, 16323291, 16323290, 16323289, 16323288, 16323286,
        ].forEach((id: number, idx: number) => {
            expect(images[idx]).toEqual({
                fileName: `somé-namé-${id}.jpg`,
                retries: 0,
                url: `http://ilarge.lisimg.com/image/${id}/10000full-som%C3%A9-nam%C3%A9.jpg`,
            });
        });
    });

    it("should parse images from other page", async () => {
        const page = new ListalPage(
            fetchOther,
            namingStrategy,
            "http://www.listal.com/som%C3%A9-nam%C3%A9",
            5,
        );

        const images = await page.getImages();
        expect(images.length).toEqual(20);

        [
            15566198, 15412471, 15412469, 15412468, 15412467, 15412465, 15412464, 15412462, 15412460, 15412458,
            15412456, 15412449, 15412443, 15412442, 15412434, 15412433, 15366260, 15366258, 15366255, 15366249,
        ].forEach((id: number, idx: number) => {
            expect(images[idx]).toEqual({
                fileName: `somé-namé-${id}.jpg`,
                retries: 0,
                url: `http://ilarge.lisimg.com/image/${id}/10000full-som%C3%A9-nam%C3%A9.jpg`,
            });
        });
    });

    it("should get total number of pages from person page", async () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "http://www.listal.com/some-name",
            1,
        );
        expect(await page.getTotalPages()).toEqual(371);
    });

    it("should get total number of pages from other page", async () => {
        const page = new ListalPage(
            fetchOther,
            namingStrategy,
            "http://www.listal.com/movie/batman",
            1,
        );
        expect(await page.getTotalPages()).toEqual(11);
    });

    it("should encode name in url if name contains non-ascii characters", () => {
        const page = new ListalPage(
            fetchPerson,
            namingStrategy,
            "somé-namé",
            5,
        );
        expect(page.getUrl()).toEqual("http://www.listal.com/som%C3%A9-nam%C3%A9/pictures//5");
    });

    it("should throw error if getting total page number from not-first page", async () => {
        const page = new ListalPage(
            fetchOther,
            namingStrategy,
            "http://www.listal.com/some-category/some-name",
            2,
        );

        let error;
        try {
            await page.getTotalPages();
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(new Error("Only first page contains proper number of pages"));
    });
});
