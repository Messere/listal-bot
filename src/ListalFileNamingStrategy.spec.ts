import ListalFileNamingStrategy from "./ListalFileNamingStrategy";

describe("ListalFileNamingStrategy", () => {
    let namingStrategy;

    beforeEach(() => {
        namingStrategy = new ListalFileNamingStrategy();
    });

    it("should make the name based on url", () => {
        expect(
            namingStrategy.getFileName("http://ilarge.lisimg.com/image/123456/1234342full-some-name.jpg"),
        ).toEqual("some-name-123456.jpg");
    });

    it("should throw an error if url is not recognized", () => {
        expect(() => {
            namingStrategy.getFileName("http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg");
        }).toThrowError(
            "Unrecognized listal image url: http://zlarge.lisimg.com/image/123456/1234342full-some-name.jpg",
        );
    });
});
