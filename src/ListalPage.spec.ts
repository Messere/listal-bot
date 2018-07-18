import * as readFile from "read-file";
import ListalFileNamingStrategy from "./ListalFileNamingStrategy";
import ListalPage from "./ListalPage";

describe("Listal page", () => {
    let namingStrategy;
    let logger;
    let fetch;
    let fetchLast;

    beforeEach(() => {
        namingStrategy = new ListalFileNamingStrategy();
        logger = {};
        fetch = () => {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(
                    readFile.sync("test-fixtures/listal-page.html").toString(),
                ),
            });
        };
        fetchLast = () => {
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve(
                    readFile.sync("test-fixtures/listal-page-last.html").toString(),
                ),
            });
        };
    });

    it("should properly get page name from url", () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
    });

    it("should properly get encoded page name from url", () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/som%C3%A9-nam%C3%A9/pictures",
            5,
        );
        expect(page.getName()).toEqual("somé-namé");
    });

    it("should properly get encoded page name from url even if encoding is broken", () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/som%A9-nam%A9/pictures//5",
            5,
        );
        expect(page.getName()).toEqual("som%A9-nam%A9");
    });

    it("should assume that url is in fact name", () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "some-name",
            5,
        );
        expect(page.getName()).toEqual("some-name");
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });

    it("should throw an error if invalid / unrecognized listal url is encountered", () => {
        expect(() => new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://google.com",
            5,
        )).toThrowError("Unrecognized listal url: \"http://google.com\"");
    });

    it("should get a proper url", () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );
        expect(page.getUrl()).toEqual("http://www.listal.com/some-name/pictures//5");
    });

    it("should parse images from page", async () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );

        const images = await page.getImages();
        expect(images.length).toEqual(20);

        const ids = [
            16492033, 16368243, 16368242, 16368240, 16368239, 16368142, 16356028, 16352875, 16339090,
            16339053, 16323685, 16323297, 16323294, 16323293, 16323292, 16323291, 16323290, 16323289, 16323288,
            16323286,
        ].forEach((id: number, idx: number) => {
            expect(images[idx]).toEqual({
                fileName: `some-name-${id}.jpg`,
                retries: 0,
                url: `http://ilarge.lisimg.com/image/${id}/10000full-some-name.jpg`,
            });
        });
    });

    it("should tell that there's next page", async () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );
        expect(await page.hasNextPage()).toBeTruthy();
    });

    it("should get next page", async () => {
        const page = new ListalPage(
            fetch,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );
        const nextPage = await page.getNextPage();
        expect(nextPage.getUrl()).toEqual("http://www.listal.com/some-name/pictures//2");
    });

    it("should tell that there's no next page", async () => {
        const page = new ListalPage(
            fetchLast,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );
        expect(await page.hasNextPage()).toBeFalsy();
    });

    it("should throw error when trying to get next page on last one", async () => {
        const page = new ListalPage(
            fetchLast,
            namingStrategy,
            logger,
            "http://www.listal.com/some-name",
            5,
        );

        let error;
        try {
            await page.getNextPage();
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(new Error("Cannot find next page url"));
    });
});
